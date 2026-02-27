"""
Asian Paints Agent Portfolio – FastAPI Backend
===============================================
Public endpoints  : services list, gallery list, enquiry submission
Admin endpoints   : CRUD for enquiries, services, gallery (JWT-protected)
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

from config import supabase, supabase_admin, FRONTEND_URL

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="Asian Paints Agent Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic Models ─────────────────────────────────────────────────────────

class EnquiryCreate(BaseModel):
    """Payload for a new customer enquiry."""
    name: str = Field(..., min_length=2, max_length=100)
    address: str = Field(..., min_length=5, max_length=300)
    contact_number: str = Field(..., min_length=10, max_length=15)
    pin_code: str = Field(..., min_length=4, max_length=10)
    message: Optional[str] = Field(None, max_length=500)


class ServiceCreate(BaseModel):
    """Payload for creating / updating a paint service."""
    title: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5, max_length=500)
    image_url: Optional[str] = None


class ServiceUpdate(BaseModel):
    """Payload for updating a paint service (all fields optional)."""
    title: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, min_length=5, max_length=500)
    image_url: Optional[str] = None


# ── Auth Dependency ──────────────────────────────────────────────────────────

async def verify_admin(authorization: str = Header(...)):
    """
    Verify the Supabase JWT token from the Authorization header.
    Expects: 'Bearer <token>'
    """
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user.user
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Unauthorized: {str(exc)}")


# ══════════════════════════════════════════════════════════════════════════════
#  PUBLIC ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/health")
async def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


# ── Services (public) ───────────────────────────────────────────────────────

@app.get("/api/services")
async def get_services():
    """Return all paint services."""
    try:
        response = supabase_admin.table("paint_services").select("*").execute()
        return {"data": response.data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── Gallery (public) ────────────────────────────────────────────────────────

@app.get("/api/gallery")
async def get_gallery():
    """Return signed URLs for all files in the 'gallery' storage bucket."""
    try:
        files = supabase_admin.storage.from_("gallery").list()
        gallery_items = []
        for f in files:
            if f.get("name") == ".emptyFolderPlaceholder":
                continue
            # Create a signed URL valid for 1 hour (3600 seconds)
            signed = supabase_admin.storage.from_("gallery").create_signed_url(
                f["name"], 3600
            )
            file_type = "video" if f["name"].lower().endswith((".mp4", ".webm", ".mov")) else "image"
            gallery_items.append({
                "name": f["name"],
                "url": signed.get("signedURL", ""),
                "type": file_type,
                "size": f.get("metadata", {}).get("size", 0),
            })
        return {"data": gallery_items}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── Enquiry (public) ────────────────────────────────────────────────────────

@app.post("/api/enquiries")
async def create_enquiry(payload: EnquiryCreate):
    """Submit a new customer enquiry."""
    try:
        data = {
            "id": str(uuid.uuid4()),
            "name": payload.name,
            "address": payload.address,
            "contact_number": payload.contact_number,
            "pin_code": payload.pin_code,
            "message": payload.message or "",
            "created_at": datetime.utcnow().isoformat(),
        }
        response = supabase_admin.table("customer_enquiries").insert(data).execute()
        return {"message": "Enquiry submitted successfully", "data": response.data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ══════════════════════════════════════════════════════════════════════════════
#  ADMIN ENDPOINTS  (JWT-protected)
# ══════════════════════════════════════════════════════════════════════════════

# ── Enquiries ────────────────────────────────────────────────────────────────

@app.get("/api/admin/enquiries")
async def admin_get_enquiries(user=Depends(verify_admin)):
    """List all customer enquiries (newest first)."""
    try:
        response = (
            supabase_admin.table("customer_enquiries")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return {"data": response.data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.delete("/api/admin/enquiries/{enquiry_id}")
async def admin_delete_enquiry(enquiry_id: str, user=Depends(verify_admin)):
    """Delete a customer enquiry by ID."""
    try:
        response = (
            supabase_admin.table("customer_enquiries")
            .delete()
            .eq("id", enquiry_id)
            .execute()
        )
        return {"message": "Enquiry deleted successfully"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── Services (admin) ────────────────────────────────────────────────────────

@app.post("/api/admin/services")
async def admin_create_service(payload: ServiceCreate, user=Depends(verify_admin)):
    """Add a new paint service."""
    try:
        data = {
            "id": str(uuid.uuid4()),
            "title": payload.title,
            "description": payload.description,
            "image_url": payload.image_url or "",
        }
        response = supabase_admin.table("paint_services").insert(data).execute()
        return {"message": "Service created", "data": response.data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.put("/api/admin/services/{service_id}")
async def admin_update_service(
    service_id: str, payload: ServiceUpdate, user=Depends(verify_admin)
):
    """Update an existing paint service."""
    try:
        update_data = {k: v for k, v in payload.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        response = (
            supabase_admin.table("paint_services")
            .update(update_data)
            .eq("id", service_id)
            .execute()
        )
        return {"message": "Service updated", "data": response.data}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.delete("/api/admin/services/{service_id}")
async def admin_delete_service(service_id: str, user=Depends(verify_admin)):
    """Delete a paint service."""
    try:
        supabase_admin.table("paint_services").delete().eq("id", service_id).execute()
        return {"message": "Service deleted"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── Gallery (admin) ─────────────────────────────────────────────────────────

@app.post("/api/admin/gallery/upload")
async def admin_upload_file(file: UploadFile = File(...), user=Depends(verify_admin)):
    """Upload an image or video to the 'gallery' Supabase storage bucket."""
    try:
        # Create unique filename to prevent collisions
        ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
        unique_name = f"{uuid.uuid4().hex[:12]}_{file.filename}"
        contents = await file.read()
        supabase_admin.storage.from_("gallery").upload(
            unique_name, contents, {"content-type": file.content_type}
        )
        return {"message": "File uploaded", "filename": unique_name}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.delete("/api/admin/gallery/{filename}")
async def admin_delete_file(filename: str, user=Depends(verify_admin)):
    """Delete a file from the 'gallery' storage bucket."""
    try:
        supabase_admin.storage.from_("gallery").remove([filename])
        return {"message": "File deleted"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── Run ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
