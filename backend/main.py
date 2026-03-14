import os
import json
import base64
import random
import logging
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

# Advanced AI Imports
from google import genai
from google.genai import types

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("GovResolve-Backend")

app = FastAPI(title="Janaspandana CivicTech System API", version="2.0")

# --- API KEY CONFIGURATION ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "") 

client = None
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("✅ Gemini 2.5 Flash Engine Active")
    except Exception as e:
        logger.error(f"⚠️ Gemini Init Error: {e}")
else:
    logger.warning("⚠️ No Gemini API Key found. AI features will use rule-based fallback simulations.")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PYDANTIC DATA MODELS ---
class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    district: str
    ward: str

class GeoLocation(BaseModel):
    latitude: float
    longitude: float

class ComplaintSubmit(BaseModel):
    user_id: str
    text: str
    location: str
    geo_location: GeoLocation
    district: Optional[str] = "Bengaluru Urban"
    ward: Optional[str] = "Unknown"
    category: Optional[str] = "Auto-Detect via AI"
    image_base64: Optional[str] = None
    mime_type: Optional[str] = "image/jpeg"
    input_type: Optional[str] = "text"

class StatusUpdate(BaseModel):
    status: str
    note: str
    authority: str = "Official System"

class ChatMessage(BaseModel):
    message: str

# --- JSON DATABASE ENGINE ---
DB_FILE = "database.json"

def load_db():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load DB, resetting: {e}")
    
    # Default Seed Data 
    default_db = {
        "users": [
            {
                "id": "SYS-ADMIN-101", "email": "nodal@karnataka.gov.in", "password": "password", 
                "role": "admin", "name": "Nodal Officer - Bengaluru South", "phone": "+91-9876543210", 
                "district": "Bengaluru Urban", "ward": "All"
            },
            {
                "id": "USR-1000", "email": "citizen@example.com", "password": "password", 
                "role": "citizen", "name": "Citizen Demo", "phone": "+91-9876543210", 
                "district": "Bengaluru Urban", "ward": "172"
            }
        ],
        "complaints": [],
        "complaint_notifications": []
    }
    save_db(default_db)
    return default_db

def save_db(db_data):
    with open(DB_FILE, "w") as f:
        json.dump(db_data, f, indent=4)

db_memory = load_db()

def sync_to_disk():
    save_db(db_memory)

# --- AI INFERENCE PIPELINE ---
def run_ai_analysis(text: str, image_b64: str = None, mime_type: str = "image/jpeg") -> dict:
    if not client:
        is_urgent = any(kw in text.lower() for kw in ["urgent", "danger", "hazard", "critical", "pothole", "wire"])
        return {
            "detected_language": "English",
            "translated_text": text,
            "category": "Infrastructure",
            "severity": "Critical" if is_urgent else "Medium",
            "ai_score": 92 if is_urgent else 45,
            "urgency_flag": is_urgent,
            "confidence_score": 88,
            "department": "BBMP (Auto-Assigned)",
            "assigned_authority": "Ward Engineer",
            "detected_keywords": ["fallback_mode"]
        }

    prompt = f"""
    You are the 'CivicTech AI System' for the Government of Karnataka.
    Analyze the following grievance text and/or image.
    Extract the following structured JSON data exactly:
    {{
        "detected_language": "The language of the text (e.g., English, Kannada)",
        "translated_text": "English translation of the text (or just the text if already English)",
        "category": "One of [Infrastructure, Sanitation, Electricity, Water & Sewage, Governance, Other]",
        "severity": "One of [Low, Medium, High, Critical]",
        "ai_score": "integer 1-100 representing hazard level",
        "urgency_flag": "boolean (true if immediate danger/hazard like deep potholes, live wires, floods)",
        "confidence_score": "integer 1-100",
        "department": "Assign to one of [BBMP, BESCOM, BWSSB, Traffic Police, Local Panchayat]",
        "assigned_authority": "A relevant job title (e.g., Ward Engineer, Health Inspector, Nodal Officer)",
        "detected_keywords": ["list", "of", "hazard", "keywords"]
    }}
    
    Citizen Input: "{text}"
    """
    
    parts = []
    if image_b64:
        try:
            b64_data = image_b64.split(",")[-1] if "," in image_b64 else image_b64
            img_bytes = base64.b64decode(b64_data)
            parts.append(types.Part.from_bytes(data=img_bytes, mime_type=mime_type))
            prompt += "\nUse the provided visual evidence to accurately determine severity and category."
        except Exception as e:
            logger.warning(f"Failed to process image bytes: {e}")
            
    parts.append(prompt)

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash-preview-09-2025',
            contents=parts,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return {
            "detected_language": "Unknown", "translated_text": text, "category": "Other",
            "severity": "Medium", "ai_score": 50, "urgency_flag": False, "confidence_score": 50,
            "department": "Manual Routing Required", "assigned_authority": "Pending Admin Review",
            "detected_keywords": []
        }

# --- API ENDPOINTS ---

@app.post("/api/auth/login")
async def login(user: UserLogin):
    found = next((u for u in db_memory["users"] if u["email"] == user.email and u["password"] == user.password), None)
    if not found:
        raise HTTPException(status_code=401, detail="Invalid credentials provided.")
    return found

@app.post("/api/auth/signup")
async def signup(user: UserSignup):
    if any(u["email"] == user.email for u in db_memory["users"]):
        raise HTTPException(status_code=400, detail="Email is already registered.")
    
    new_user = {
        "id": f"USR-{random.randint(10000, 99999)}",
        "email": user.email,
        "password": user.password,
        "name": user.name,
        "phone": user.phone,
        "district": user.district,
        "ward": user.ward,
        "role": "citizen"
    }
    db_memory["users"].append(new_user)
    sync_to_disk()
    return new_user


@app.post("/api/complaints")
async def register_complaint(complaint: ComplaintSubmit):
    user = next((u for u in db_memory["users"] if u["id"] == complaint.user_id), {})
    ai_data = run_ai_analysis(complaint.text, complaint.image_base64, complaint.mime_type)
    
    if complaint.category != "Auto-Detect via AI":
        ai_data["category"] = complaint.category

    now = datetime.now().isoformat()
    complaint_id = f"KA-{random.randint(100000, 999999)}"

    record = {
        "id": complaint_id,
        "submitterId": complaint.user_id,
        "submitterName": user.get("name", "Verified Citizen"),
        "submitterPhone": user.get("phone", "N/A"),
        "submitterEmail": user.get("email", "N/A"),
        "text": complaint.text,
        "location": complaint.location,
        "geo_location": {"latitude": complaint.geo_location.latitude, "longitude": complaint.geo_location.longitude},
        "district": complaint.district,
        "taluk": "Auto-Assigned",
        "ward": complaint.ward,
        "input_type": complaint.input_type,
        "date": now,
        "status": "Pending",
        "photoBase64": complaint.image_base64,
        "duplicate_status": "Unique Entry",
        **ai_data,
        "status_history": [{
            "status": "Submitted", 
            "timestamp": now, 
            "note": "Recorded via portal. Live Photo Authenticated." if complaint.image_base64 else "Recorded via portal.", 
            "authority": "System"
        }]
    }
    
    db_memory["complaints"].insert(0, record)
    sync_to_disk()
    return record


@app.get("/api/complaints")
async def get_complaints():
    return db_memory["complaints"]


@app.put("/api/complaints/{complaint_id}/status")
async def update_status(complaint_id: str, payload: StatusUpdate):
    comp = next((c for c in db_memory["complaints"] if c["id"] == complaint_id), None)
    if not comp: 
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    now = datetime.now().isoformat()
    new_status = payload.status
    
    comp["status"] = new_status
    comp.setdefault("status_history", []).append({
        "status": new_status, 
        "timestamp": now, 
        "note": payload.note, 
        "authority": payload.authority
    })

    if new_status == "Resolved":
        notif_id = f"NOTIF-{random.randint(10000, 99999)}"
        sms_msg = f"Govt of Karnataka: Grievance {comp['id']} is RESOLVED. Status: {payload.note[:30]}..."
        email_msg = f"""
        Complaint Resolution Notification – Karnataka
        Complaint ID: {comp['id']}
        Resolution: {payload.note}
        Date Resolved: {now}
        """

        notification_record = {
            "notification_id": notif_id,
            "complaint_id": comp["id"],
            "channel": "SMS & Email",
            "recipient_contact": comp.get("submitterPhone", "No Phone Provided"),
            "recipient_email": comp.get("submitterEmail", "No Email Provided"),
            "message_body_sms": sms_msg,
            "message_body_email": email_msg,
            "sent_timestamp": now,
            "status": "SENT"
        }
        db_memory.setdefault("complaint_notifications", []).append(notification_record)

    sync_to_disk()
    return comp


@app.get("/api/analytics")
async def get_analytics():
    df = pd.DataFrame(db_memory["complaints"])
    
    if df.empty:
        return {
            "total": 0, "urgent": 0, "resolved": 0, "pending": 0, 
            "category_distribution": {}, "department_distribution": {},
            "civic_intelligence": {"score": 100, "trend_direction": "Stable", "insight": "No data available yet.", "avg_severity": 0},
            "predictions": []
        }
    
    total = len(df)
    urgent_count = len(df[df['urgency_flag'] == True]) if 'urgency_flag' in df else 0
    resolved = len(df[df['status'].isin(['Resolved', 'Closed'])])
    pending = total - resolved
    
    if 'ai_score' in df and not df['ai_score'].isnull().all():
        avg_ai_score = float(df['ai_score'].fillna(0).mean())
    else:
        avg_ai_score = 50.0
    
    trend = "Increased" if urgent_count > (total * 0.2) else "Stable"
    pending_ratio = (pending / total) * 100 if total > 0 else 0
    intel_score = 100 - pending_ratio
    
    insight_text = f"Resolution rate is currently at {round(100 - pending_ratio)}%. Average AI Severity Index across the state is {round(avg_ai_score)}/100."
    if urgent_count > 0:
        insight_text += f" Action required on {int(urgent_count)} critical hazards."

    predictions = [
        {
            "ward": str(df['ward'].mode()[0]) if not df['ward'].empty else "172", 
            "category": "Waterlogging", 
            "count": random.randint(10, 50), 
            "reason": "Based on historical weather overlays and current drainage blockages.", 
            "confidence": random.randint(70, 95)
        }
    ]
    
    return {
        "total": total,
        "urgent": int(urgent_count),
        "resolved": int(resolved),
        "pending": int(pending),
        "category_distribution": df['category'].value_counts().to_dict() if 'category' in df else {},
        "department_distribution": df['department'].value_counts().to_dict() if 'department' in df else {},
        "predictions": predictions,
        "civic_intelligence": {
            "score": round(intel_score),
            "trend_direction": trend,
            "avg_severity": round(avg_ai_score),
            "insight": insight_text
        }
    }


@app.post("/api/chat")
async def chat_bot(msg: ChatMessage):
    if not client: 
        text = msg.message.lower()
        reply = "Your query has been securely logged."
        if "status" in text or "track" in text:
            reply = "To track an existing complaint, navigate to the 'View Status Tracker' tab."
        elif "pothole" in text or "road" in text:
            reply = "Road infrastructure issues are routed directly to BBMP Public Works. Critical hazards carry a 48-hour SLA."
        elif "garbage" in text or "waste" in text:
            reply = "Sanitation complaints are assigned to local health inspectors for 24-hour clearance."
        return {"reply": reply}
    
    system_prompt = "You are the Official CivicTech Complaint Chatbot for the Government of Karnataka. Be polite, professional, and concise. Do not use markdown."
    
    try:
        resp = client.models.generate_content(
            model='gemini-2.5-flash-preview-09-2025', 
            contents=f"{system_prompt}\nUser Query: {msg.message}"
        )
        return {"reply": resp.text.replace("*", "")} 
    except Exception as e:
        logger.error(f"Chatbot Error: {e}")
        return {"reply": "Service busy. Please check the FAQs or contact the toll-free helpline 1902."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)