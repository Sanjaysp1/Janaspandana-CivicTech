🏛️ Janaspandana: The Digital Pulse of Civic Governance

An AI-First Public Grievance Redressal System for the Government of Karnataka.

Janaspandana is a visionary platform designed to bridge the trust gap between citizens and administration. By integrating Google Gemini 2.5 Flash, Native Geospatial Mapping, and Zero-Trust Verification, we have transformed public reporting from a slow, manual process into a high-velocity, predictive engine for urban improvement.

💡 The Vision

In a rapidly urbanizing world, traditional complaint boxes are obsolete. They suffer from fake reports, manual triage delays, and language barriers. Janaspandana reimagines civic engagement by introducing accountability through technology. We ensure every grievance is verified at the source, analyzed by AI, and resolved with transparency.

✨ Features That Set Us Apart

👤 For the Empowered Citizen

Zero-Trust Live Capture: To eliminate fraudulent reports, our system enforces Live Camera Capture. No gallery uploads are allowed, ensuring that every photo is an authentic, real-time record of the hazard.

Intelligent AI Vision: Powered by Gemini AI, the system "sees" the issue. It automatically estimates pothole severity, identifies bio-hazards in garbage, and detects structural deterioration, reducing the need for citizens to write long descriptions.

Linguistic Inclusivity: Citizens can report issues in Kannada. Our backend automatically translates and summarizes the grievance into English for official processing, ensuring no voice is ignored.

Digital Affidavit Generation: Instantly generate a Multi-Page PDF Affidavit. This document serves as a legal receipt, containing auto-cropped evidence grids, precise GPS metadata, and official system e-seals.

🛡️ For the Nodal Officer

Predictive Civic Intelligence: We don't just react; we forecast. Our models analyze historical data to predict infrastructure stress points before they become critical hazards.

Spatial Hazard Heatmap: An interactive, severity-coded Live Heatmap clusters high-priority "Red Zones," allowing nodal officers to visualize the city's health and deploy resources where they are needed most.

The Officer Matrix: A real-time performance dashboard that tracks resolution SLAs, citizen ratings, and head-worker efficiency, fostering a culture of government accountability.

Smart Auto-Triage: AI-driven routing instantly assigns tasks to the correct department (BBMP, BESCOM, BWSSB) based on the context extracted from photos and text.

🛠️ Technical Excellence

Layer

Technology

Purpose

Frontend

React 18, Vite, Tailwind CSS

High-performance, responsive UI/UX

Mapping

Leaflet.js, OpenStreetMap

Native geospatial pin-pointing & heatmaps

Backend

Python 3.10+, FastAPI

Asynchronous, scalable API architecture

AI Intelligence

Google Gemini 2.5 Flash

Computer Vision, NLP, and Translation

Data Engine

Pandas & JSON

Real-time trend analysis and document storage

🚀 Bringing the Vision to Life (Setup)

1. The Command Center (Backend)

Navigate to the backend directory and initialize the AI engine:

cd backend
pip install fastapi uvicorn pydantic pandas google-genai
# Set your GEMINI_API_KEY environment variable for AI inference
uvicorn main:app --reload


2. The User Interface (Frontend)

Navigate to the frontend directory and launch the portal:

cd frontend
npm install
npm run dev


Access the system at http://localhost:5173

🧪 Interactive Demo Access

We have built a one-click demo experience directly into the login screen:

Citizen Access: Experience the full lifecycle of reporting—from live capture to PDF generation.

Official Access: Step into the shoes of a Nodal Officer to manage the heatmap and triage queues.

⚖️ Legal & Disclaimer

This platform is a demonstration of CivicTech innovation for educational and hackathon purposes. While utilizing production-grade AI, it is not currently connected to live government databases. False reporting in a production environment is punishable under Section 182 of the IPC.

Designed, Developed, and Optimized for a Smarter Karnataka.
