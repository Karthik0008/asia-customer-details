# Asian Paints Agent Portfolio – Setup Guide

## 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note down:
   - **Project URL** (e.g. `https://abcdefg.supabase.co`)
   - **anon public key** (Settings → API → `anon` key)
   - **service_role key** (Settings → API → `service_role` key)

---

## 2. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Customer Enquiries
CREATE TABLE customer_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Paint Services
CREATE TABLE paint_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT DEFAULT ''
);

-- Allow public inserts for enquiries (RLS)
ALTER TABLE customer_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON customer_enquiries
  FOR INSERT WITH CHECK (true);

-- Allow public reads for services
ALTER TABLE paint_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public reads" ON paint_services
  FOR SELECT USING (true);
```

---

## 3. Create Storage Bucket

1. Go to **Storage** in Supabase.
2. Click **New Bucket** → name it `gallery`.
3. Set it as **public** (so signed URLs work correctly).
4. In bucket policies, add a policy to allow public reads:
   - Policy name: `Allow public reads`
   - Allowed operation: `SELECT`
   - Target roles: `anon`

---

## 4. Create Admin User

1. Go to **Authentication → Users** in Supabase.
2. Click **Add User** → **Create New User**.
3. Enter the admin email and password.
4. This email/password is what you'll use to log in at `/admin`.

---

## 5. Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill in:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
VITE_WHATSAPP_NUMBER=919999999999
```

---

## 6. Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
# → Runs on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → Runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 7. Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → Import → select the repo.
3. Set **Root Directory** to `frontend`.
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` → set to your Render backend URL
   - `VITE_WHATSAPP_NUMBER`
5. Deploy.

### Backend → Render

1. Push the `backend/` folder to a GitHub repo.
2. Go to [render.com](https://render.com) → New Web Service.
3. Connect your repo, set **Root Directory** to `backend`.
4. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL` → your Vercel URL
6. Deploy.

> **After deployment**, update `VITE_API_URL` in Vercel to point to your Render URL, and update `FRONTEND_URL` in Render to point to your Vercel URL.

---

## 8. Folder Structure

```
asia customer details/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py             # Supabase client config
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Env vars template
│   └── .env                  # Your actual env vars (gitignored)
├── frontend/
│   ├── src/
│   │   ├── main.jsx          # React entry point
│   │   ├── App.jsx           # Routes & auth guards
│   │   ├── index.css         # Tailwind + brand theme
│   │   ├── lib/
│   │   │   └── supabase.js   # Supabase client
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── HeroSection.jsx
│   │       ├── ServicesSection.jsx
│   │       ├── GallerySection.jsx
│   │       ├── AboutSection.jsx
│   │       ├── ContactForm.jsx
│   │       ├── WhatsAppButton.jsx
│   │       └── admin/
│   │           ├── EnquiriesTable.jsx
│   │           ├── GalleryManager.jsx
│   │           └── ServicesManager.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
└── docs/
    └── SETUP.md              # This file
```
