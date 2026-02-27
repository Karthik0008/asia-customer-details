# Asian Paints Agent Portfolio – Setup Guide

This project is a full-stack portfolio website for an Asian Paints agent. It uses FastAPI for the backend, React (Vite) for the frontend, and Supabase for the database, authentication, and storage.

---

## 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note down:
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **anon public key** (Settings → API → `anon` key)
   - **service_role key** (Settings → API → `service_role` key)

---

## 2. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Customer Enquiries Table
CREATE TABLE customer_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Paint Services Table
CREATE TABLE paint_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT DEFAULT ''
);

-- Enable Row Level Security (RLS)
ALTER TABLE customer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE paint_services ENABLE ROW LEVEL SECURITY;

-- Policies for customer_enquiries
CREATE POLICY "Allow public inserts" ON customer_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin select" ON customer_enquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete" ON customer_enquiries FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for paint_services
CREATE POLICY "Allow public select" ON paint_services FOR SELECT USING (true);
CREATE POLICY "Allow admin insert" ON paint_services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update" ON paint_services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete" ON paint_services FOR DELETE USING (auth.role() = 'authenticated');
```

---

## 3. Create Storage Bucket

1. Go to **Storage** in Supabase.
2. Click **New Bucket** → name it `gallery`.
3. Set it as **Public**.
4. In bucket policies, add a policy to allow public reads and authenticated uploads/deletes.

---

## 4. Create Admin User

1. Go to **Authentication → Users**.
2. Click **Add User** → **Create New User**.
3. Use the email/password you want for the admin login.

---

## 5. Environment Variables

### Backend (`backend/.env`)

Create a `.env` file in the `backend/` folder:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` folder:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
VITE_WHATSAPP_NUMBER=919999999999
```

---

## 6. Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 7. Deployment

### Backend (Render)
1. Set root directory to `backend`.
2. Build Command: `pip install -r requirements.txt`.
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`.
4. Add all environment variables from `backend/.env`.

### Frontend (Vercel)
1. Set root directory to `frontend`.
2. Add all environment variables from `frontend/.env`.
3. Note: Set `VITE_API_URL` to your Render backend URL.
