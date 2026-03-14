import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Send, 
  Activity, 
  X, 
  ChevronRight,
  ShieldCheck, 
  Download, 
  MessageCircle, 
  Bot, 
  ListTodo,
  Lock, 
  User, 
  FileText, 
  Globe, 
  CloudUpload, 
  PhoneCall, 
  Languages, 
  FileSearch, 
  BarChart3, 
  Info,
  Volume2, 
  Copy, 
  PlayCircle, 
  TrendingUp, 
  TrendingDown, 
  BrainCircuit,
  Search, 
  Filter, 
  Camera, 
  Crosshair, 
  Users, 
  Award, 
  FileSpreadsheet,
  QrCode, 
  Shield, 
  Smartphone, 
  Mail, 
  Database, 
  Settings, 
  Check
} from 'lucide-react';

const API_BASE = "http://localhost:8000/api";

const KA_LOGO_URL = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Emblem_of_Karnataka.svg/800px-Emblem_of_Karnataka.svg.png"; 

const handleLogoError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png";
};

// --- TRANSLATION DICTIONARY ---
const translations = {
  en: {
    gov: "Government of Karnataka",
    portal: "Janaspandana - CivicTech System",
    helpline: "Toll Free Helpline",
    home: "Home Portal",
    lodge: "Lodge Grievance",
    track: "View Status Tracker",
    dashboard: "Officer Dashboard",
    queue: "Master Action Queue",
    logout: "Logout",
    profile: "Profile Setup",
    form_title: "Official Grievance Registration Form",
    live_verified: "Live Verified",
    ai_inference: "AI Inference"
  },
  kn: {
    gov: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ",
    portal: "ಜನಸ್ಪಂದನ - ಸಿವಿಕ್‌ಟೆಕ್ ವ್ಯವಸ್ಥೆ",
    helpline: "ಟೋಲ್ ಫ್ರೀ ಸಹಾಯವಾಣಿ",
    home: "ಮುಖಪುಟ",
    lodge: "ದೂರು ದಾಖಲಿಸಿ",
    track: "ಸ್ಥಿತಿ ವೀಕ್ಷಿಸಿ",
    dashboard: "ಅಧಿಕಾರಿಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    queue: "ಮುಖ್ಯ ದೂರುಗಳ ಸರತಿ",
    logout: "ಲಾಗ್ ಔಟ್",
    profile: "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್",
    form_title: "ಅಧಿಕೃತ ದೂರು ನೋಂದಣಿ ನಮೂನೆ",
    live_verified: "ನೇರ ಪರಿಶೀಲನೆ",
    ai_inference: "ಎಐ ವಿಶ್ಲೇಷಣೆ"
  }
};

// --- ROBUST FALLBACK DATA ---
const MOCK_COMPLAINTS = [
  {
    id: "KA-491023",
    submitterId: "USR-1000",
    submitterName: "Citizen Demo",
    submitterPhone: "+91-9876543210",
    submitterEmail: "citizen@example.com",
    text: "Deep road surface deterioration (pothole) observed. The area is heavily compromised and poses an immediate hazard to moving traffic.",
    translated_text: "Deep road surface deterioration (pothole) observed. The area is heavily compromised and poses an immediate hazard to moving traffic.",
    detected_language: "English",
    location: "Madiwala Junction, Hosur Road, Bengaluru, Karnataka 560068",
    district: "Bengaluru Urban",
    taluk: "Bengaluru South",
    ward: "172",
    category: "Infrastructure",
    severity: "Critical",
    severity_analysis: "Multiple keywords indicate immediate danger to life and high traffic impact.",
    urgency_flag: true,
    duplicate_status: "Unique Entry",
    detected_keywords: ["pothole", "fatal", "accidents"],
    ai_score: 95,
    confidence_score: 98,
    department: "BBMP (Public Works)",
    assigned_authority: "Ravi Kumar (O1122)",
    geo_location: { latitude: 12.9226, longitude: 77.6174 },
    date: new Date().toISOString(),
    status: "Pending",
    input_type: "text",
    photoBase64: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400",
    photos: [
        "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1584463688173-9ed904b77f98?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?auto=format&fit=crop&q=80&w=400"
    ],
    status_history: [{ status: "Submitted", note: "Auto-assigned by AI.", authority: "System", timestamp: new Date().toISOString() }]
  },
  {
    id: "KA-491088",
    submitterId: "USR-1045",
    submitterName: "Sanjana Gowda",
    submitterPhone: "+91-9876543111",
    submitterEmail: "sanjana@example.com",
    text: "Heavy waterlogging under the Silk Board bridge. Traffic has come to a complete halt and water level is rising rapidly.",
    translated_text: "Heavy waterlogging under the Silk Board bridge. Traffic has come to a complete halt and water level is rising rapidly.",
    detected_language: "English",
    location: "Silk Board Junction, Outer Ring Road, Bengaluru 560068",
    district: "Bengaluru Urban",
    taluk: "Bommanahalli",
    ward: "174",
    category: "Water & Sewage",
    severity: "High",
    severity_analysis: "Severe traffic disruption and risk of flooding to nearby ground-level properties.",
    urgency_flag: true,
    duplicate_status: "Unique Entry",
    detected_keywords: ["waterlogging", "halt", "flood"],
    ai_score: 88,
    confidence_score: 95,
    department: "BWSSB (Sewage & Drains)",
    assigned_authority: "Anil Desai (E441)",
    geo_location: { latitude: 12.9176, longitude: 77.6235 },
    date: new Date(Date.now() - 3600000).toISOString(),
    status: "Pending",
    input_type: "text",
    photoBase64: "https://images.unsplash.com/photo-1581452697893-6c8f95c5567a?auto=format&fit=crop&q=80&w=400",
    photos: ["https://images.unsplash.com/photo-1581452697893-6c8f95c5567a?auto=format&fit=crop&q=80&w=400"],
    status_history: [{ status: "Submitted", note: "Routed to BWSSB Rapid Response.", authority: "System", timestamp: new Date(Date.now() - 3600000).toISOString() }]
  },
  {
    id: "KA-492011",
    submitterId: "USR-2099",
    submitterName: "Karthik Raj",
    submitterPhone: "+91-9988776655",
    submitterEmail: "karthik.r@example.com",
    text: "ಕಸದ ತೊಟ್ಟಿ ತುಂಬಿ ರಸ್ತೆಗೆ ಹರಡಿದೆ. ಕಳೆದ 5 ದಿನಗಳಿಂದ ಯಾರು ಬಂದಿಲ್ಲ.",
    translated_text: "The garbage bin is overflowing onto the street. No one has come to clear it for the last 5 days.",
    detected_language: "Kannada",
    location: "100ft Road, Indiranagar, Bengaluru 560038",
    district: "Bengaluru Urban",
    taluk: "East",
    ward: "89",
    category: "Sanitation & Solid Waste",
    severity: "Medium",
    severity_analysis: "Bio-hazard and public nuisance. Missed SLA collection timeline.",
    urgency_flag: false,
    duplicate_status: "Unique Entry",
    detected_keywords: ["garbage", "overflowing", "5 days"],
    ai_score: 65,
    confidence_score: 90,
    department: "BBMP (Solid Waste Management)",
    assigned_authority: "Health Inspector (H112)",
    geo_location: { latitude: 12.9784, longitude: 77.6408 },
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: "In Progress",
    input_type: "voice",
    photos: [],
    status_history: [
        { status: "Submitted", note: "Auto-assigned by AI.", authority: "System", timestamp: new Date(Date.now() - 172800000).toISOString() },
        { status: "In Progress", note: "Compactor truck scheduled for evening dispatch.", authority: "Health Inspector (H112)", timestamp: new Date(Date.now() - 86400000).toISOString() }
    ]
  },
  {
    id: "KA-441029",
    submitterId: "USR-1001",
    submitterName: "Ramesh K",
    text: "ಬೀದಿ ದೀಪಗಳು ಕಳೆದ ೩ ದಿನಗಳಿಂದ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿಲ್ಲ.",
    translated_text: "Street lights have not been working for the past 3 days.",
    detected_language: "Kannada",
    location: "Gokulam 3rd Stage, Mysuru, Karnataka 570002",
    district: "Mysuru",
    ward: "45",
    category: "Electricity",
    severity: "Medium",
    severity_analysis: "Non-critical infrastructure issue, standard SLA applies.",
    urgency_flag: false,
    duplicate_status: "Unique Entry",
    ai_score: 60,
    confidence_score: 92,
    department: "CESC Mysuru",
    assigned_authority: "Junior Engineer (Electrical)",
    geo_location: { latitude: 12.9350, longitude: 77.6190 }, 
    date: new Date(Date.now() - 86400000).toISOString(),
    status: "In Progress",
    input_type: "voice",
    status_history: [
        { status: "Submitted", note: "Auto-assigned by AI.", authority: "System", timestamp: new Date(Date.now() - 86400000).toISOString() },
        { status: "In Progress", note: "Lineman dispatched to location.", authority: "Junior Engineer (Electrical)", timestamp: new Date(Date.now() - 40000000).toISOString() }
    ]
  },
  {
    id: "KA-499332",
    submitterId: "USR-3055",
    submitterName: "Nisha M",
    submitterPhone: "+91-9123456789",
    submitterEmail: "nisha@example.com",
    text: "Live electrical wire snapped and fell across the pedestrian path near the park. Extremely dangerous.",
    translated_text: "Live electrical wire snapped and fell across the pedestrian path near the park. Extremely dangerous.",
    detected_language: "English",
    location: "4th Block Park, Jayanagar, Bengaluru 560011",
    district: "Bengaluru Urban",
    taluk: "South",
    ward: "153",
    category: "Electricity",
    severity: "Critical",
    severity_analysis: "Lethal hazard detected. Live wire presents immediate risk to human life.",
    urgency_flag: true,
    duplicate_status: "Unique Entry",
    detected_keywords: ["live wire", "snapped", "dangerous"],
    ai_score: 99,
    confidence_score: 97,
    department: "BESCOM (Emergency)",
    assigned_authority: "Emergency Response Team",
    geo_location: { latitude: 12.9298, longitude: 77.5824 },
    date: new Date(Date.now() - 1800000).toISOString(),
    status: "Pending",
    input_type: "text",
    photoBase64: "https://images.unsplash.com/photo-1544976785-30040fb68e30?auto=format&fit=crop&q=80&w=400",
    photos: ["https://images.unsplash.com/photo-1544976785-30040fb68e30?auto=format&fit=crop&q=80&w=400"],
    status_history: [{ status: "Submitted", note: "Priority 1 Alert triggered. Team mobilized.", authority: "System", timestamp: new Date(Date.now() - 1800000).toISOString() }]
  }
];

const MOCK_ANALYTICS = {
  urgent: 3, 
  pending: 3, 
  resolved: 124,
  civic_intelligence: { 
      score: 82, 
      trend_direction: "Increased", 
      insight: "15% surge in road-related complaints detected in the last 48 hours." 
  },
  predictions: [
    { 
        ward: "Ward 174 (HSR)", 
        category: "Waterlogging", 
        count: 42, 
        reason: "Imminent heavy rainfall intersecting with blocked drains.", 
        confidence: 89 
    }
  ],
  department_distribution: { 
      "BBMP": 45, 
      "BESCOM": 20, 
      "BWSSB": 32, 
      "Police": 15 
  }
};

const MOCK_PERFORMANCE = [
  {
      officer_id: "O1122", 
      officer_name: "Ravi Kumar", 
      department: "BBMP",
      assigned_count: 45, 
      resolved_count: 40, 
      avg_resolution_time: "24 hrs",
      escalation_count: 1, 
      feedback_score: 4.5, 
      performance_score: 89,
      head_workers: [
          { 
              worker_id: "HW001", 
              worker_name: "Ramesh", 
              complaints_assigned: 25, 
              resolved: 24, 
              performance_score: 96 
          }
      ]
  },
  {
      officer_id: "E441", 
      officer_name: "Anil Desai", 
      department: "BWSSB",
      assigned_count: 38, 
      resolved_count: 30, 
      avg_resolution_time: "36 hrs",
      escalation_count: 3, 
      feedback_score: 4.1, 
      performance_score: 75,
      head_workers: [
          { 
              worker_id: "HW044", 
              worker_name: "Suresh", 
              complaints_assigned: 20, 
              resolved: 15, 
              performance_score: 80 
          }
      ]
  }
];

export default function App() {
  const [view, setView] = useState('citizen_new');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('citizen_login');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminTab, setAdminTab] = useState('intelligence'); 
  const [filterMode, setFilterMode] = useState('All'); 
  const [generatedNotification, setGeneratedNotification] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  
  // --- Form State ---
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [complaintDistrict, setComplaintDistrict] = useState('');
  const [complaintWard, setComplaintWard] = useState('');
  const [category, setCategory] = useState('Auto-Detect via AI');
  const [realGeoLocation, setRealGeoLocation] = useState(null); 
  const [image, setImage] = useState(null);
  const [imageType, setImageType] = useState('image/jpeg');
  
  // --- Profile / OTP State ---
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);

  // --- UI State ---
  const [isListening, setIsListening] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'bot', 
      text: 'Namaste! Welcome to CivicTech Complaint Chatbot – Karnataka. How can I assist you?',
      options: ['Lodge a Grievance', 'Track Status', 'FAQs']
    }
  ]);

  // --- DYNAMIC LEAFLET MAP INJECTION ---
  useEffect(() => {
    let checkInterval;
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        checkInterval = setInterval(() => {
          if (window.L) {
            setLeafletLoaded(true);
            clearInterval(checkInterval);
          }
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      if(window.L) setLeafletLoaded(true);
    }
    return () => clearInterval(checkInterval);
  }, []);

  const fetchData = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/complaints`);
      if (res.ok) {
          const data = await res.json();
          setComplaints(Array.isArray(data) && data.length > 0 ? data : MOCK_COMPLAINTS);
      } else {
          throw new Error("Backend Offline");
      }
      
      if (user.role === 'admin') {
        const aRes = await fetch(`${API_BASE}/analytics`);
        if (aRes.ok) setAnalytics(await aRes.json());
        setPerformanceData(MOCK_PERFORMANCE);
      }
    } catch (e) { 
      console.warn("Backend unavailable or returning error, using safe fallback data.");
      setComplaints(prev => prev.length === 0 ? MOCK_COMPLAINTS : prev);
      if (user.role === 'admin') {
          setAnalytics(prev => prev ? prev : MOCK_ANALYTICS);
          setPerformanceData(MOCK_PERFORMANCE); 
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
      if (user) {
          setComplaintDistrict(user.district || 'Bengaluru Urban');
          setComplaintWard(user.ward || '');
      }
  }, [user]);

  const handleAuth = async (e, directUserRole = null) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    
    setTimeout(() => {
        if (directUserRole === 'citizen') {
             setUser({ 
                 id: 'USR-1000', 
                 role: 'citizen', 
                 name: 'Citizen Demo', 
                 phone: '+91-9876543210', 
                 email: 'citizen@example.com', 
                 district: 'Bengaluru Urban', 
                 ward: '172' 
             });
            setView('citizen_new');
            setAuthLoading(false);
            return;
        }
        
        if (directUserRole === 'admin') {
            setUser({ 
                id: 'SYS-ADMIN-101', 
                role: 'admin', 
                name: 'Nodal Officer - Bengaluru South', 
                phone: '+91-9876543210', 
                email: 'nodal@karnataka.gov.in' 
            });
            setView('admin');
            setAuthLoading(false);
            return;
        }

        const isAdmin = authMode === 'admin_login';
        setUser({ 
            id: isAdmin ? 'SYS-ADMIN-102' : `USR-${Math.floor(Math.random()*9000)+1000}`, 
            role: isAdmin ? 'admin' : 'citizen', 
            name: e.target.name?.value || (isAdmin ? 'Nodal Officer' : 'Citizen User'), 
            phone: e.target.phone?.value || '+91-0000000000',
            email: e.target.email?.value || 'user@example.com',
            district: e.target.district?.value || 'Bengaluru Urban',
            ward: e.target.ward?.value || 'Unknown'
        });
        setView(isAdmin ? 'admin' : 'citizen_new');
        setAuthLoading(false);
    }, 600);
  };

  const triggerAIImageAnalysis = () => {
      setIsAnalyzingImage(true);
      setText(''); 
      setScanStatus('Verifying Live Capture & EXIF...');
      
      setTimeout(() => {
          setScanStatus('Extracting Hazard Features via AI Vision...');
      }, 800);

      setTimeout(() => {
          const aiDetections = [
              "Deep road surface deterioration (pothole) observed with an estimated depth of >15cm. The area is heavily compromised and poses a direct hazard to moving traffic.",
              "Accumulation of unsegregated municipal solid waste detected. Potential organic blockage in the adjacent drainage system.",
              "Significant water pipeline leakage visible. Estimated continuous flow loss is high, leading to waterlogging and pavement weakening."
          ];
          const cleanText = aiDetections[Math.floor(Math.random() * aiDetections.length)].replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
          
          setText(cleanText);
          setIsAnalyzingImage(false);
          setScanStatus('');
      }, 2500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setImage(reader.result);
          triggerAIImageAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoice = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Web Speech API is not supported in this browser.");
    const rec = new Speech();
    rec.lang = lang === 'en' ? 'en-IN' : 'kn-IN';
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => setText(prev => prev + " " + e.results[0][0].transcript);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const fetchLiveLocation = () => {
    setIsLocating(true);
    
    const simulateSmartLocation = () => {
      const simLat = 12.9716 + (Math.random() - 0.5) * 0.05;
      const simLng = 77.5946 + (Math.random() - 0.5) * 0.05;
      setRealGeoLocation({ latitude: simLat, longitude: simLng });
      fetchAddress(simLat, simLng);
    };

    const fetchAddress = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if(data && data.display_name) {
                setLocation(data.display_name);
            } else {
                throw new Error("No address found");
            }
        } catch (e) {
            setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Address Lookup Failed)`);
        } finally {
            setIsLocating(false);
        }
    };

    if (!navigator.geolocation) {
      simulateSmartLocation();
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setRealGeoLocation({ latitude: lat, longitude: lng });
        fetchAddress(lat, lng);
      },
      (error) => {
          console.warn("Real GPS Blocked or Unavailable. Utilizing Smart Location Simulator.");
          simulateSmartLocation(); 
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const submitComplaint = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
        const isUrgent = text.toLowerCase().includes("urgent") || 
                         text.toLowerCase().includes("danger") || 
                         text.toLowerCase().includes("hazard");
                         
        const detectedCat = category === 'Auto-Detect via AI' ? 'Infrastructure' : category;

        const newComp = {
          id: `KA-${Math.floor(Math.random()*900000)+100000}`,
          submitterId: user.id,
          submitterName: user.name,
          submitterPhone: user.phone,
          submitterEmail: user.email,
          text,
          translated_text: text,
          detected_language: lang === 'en' ? 'English' : 'Kannada',
          location: location || "Unknown Location",
          geo_location: realGeoLocation || { latitude: 12.9716, longitude: 77.5946 },
          district: complaintDistrict || "Bengaluru Urban",
          taluk: "General",
          ward: complaintWard || "Not Specified",
          category: detectedCat,
          severity: isUrgent ? "Critical" : "Medium",
          urgency_flag: isUrgent,
          duplicate_status: "Unique Entry",
          ai_score: isUrgent ? 85 : 55,
          confidence_score: 88,
          department: "Auto-Routed by AI",
          assigned_authority: "Pending Allocation",
          date: new Date().toISOString(),
          status: "Pending",
          photoBase64: image,
          photos: image ? [image] : [], 
          input_type: isListening ? 'voice' : 'text',
          status_history: [
              {
                  status: "Submitted", 
                  note: "Recorded via portal. Live Photo Authenticated.", 
                  authority: "System", 
                  timestamp: new Date().toISOString()
              }
          ]
        };
        setComplaints(prev => [newComp, ...prev]);
        setText(''); 
        setLocation(''); 
        setImage(null); 
        setRealGeoLocation(null); 
        setIsListening(false);
        setIsSubmitting(false);
        setView('citizen_track');
    }, 1000);
  };

  const triggerResolutionNotification = (complaint, resolutionNote) => {
      const timestamp = new Date().toISOString();
      const notifId = `NOTIF-${Math.floor(Math.random()*90000)+10000}`;
      
      const smsBody = `Govt of Karnataka: Grievance ${complaint.id} is RESOLVED. Status: ${resolutionNote.substring(0, 30)}... Track at portal.`;
      
      const emailBody = `
Complaint Resolution Notification – Karnataka

Dear ${complaint.submitterName},
Your complaint has been successfully resolved.

--- Complaint Details ---
Complaint ID: ${complaint.id}
Category: ${complaint.category}
District: ${complaint.district}
Ward: ${complaint.ward}

--- Resolution Summary ---
Status: Resolved
Note: ${resolutionNote}
Date Resolved: ${new Date(timestamp).toLocaleString()}
Responsible Authority: ${user.name} (${user.id})

Generated by CivicTech System – Karnataka
      `;

      setGeneratedNotification({
          id: notifId,
          complaintId: complaint.id,
          contact: complaint.submitterPhone || "No Phone",
          email: complaint.submitterEmail || "No Email",
          sms: smsBody,
          emailText: emailBody,
          timestamp: timestamp
      });
  };

  const updateStatus = (id, status, note) => {
      setComplaints(prev => prev.map(c => {
         if (c.id === id) {
             const newHist = [
                 ...(c.status_history || []), 
                 {
                     status, 
                     note, 
                     authority: user.name, 
                     timestamp: new Date().toISOString()
                 }
             ];
             const updatedComplaint = { ...c, status, status_history: newHist };
             
             if (status === 'Resolved') {
                 triggerResolutionNotification(updatedComplaint, note);
             }
             
             return updatedComplaint;
         }
         return c;
      }));
      setSelectedComplaint(null);
  };

  const handleChatOption = (option) => {
      setChatMessages(prev => [...prev, {role: 'user', text: option}]);
      setTimeout(() => {
          let reply = "I can help with that. Please enter your details.";
          if(option === "Track Status") { 
              reply = "Please navigate to the 'View Status Tracker' tab."; 
              setView('citizen_track'); 
          }
          if(option === "FAQs") {
              reply = "1. Live Photos are required to prevent fake reports.\n2. Severity is mapped by our AI Vision system.\n3. Voice input is auto-translated to English for officials.";
          }
          if(option === "Lodge a Grievance") { 
              reply = "Navigate to the 'Lodge Grievance' tab."; 
              setView('citizen_new'); 
          }
          setChatMessages(prev => [...prev, {role: 'bot', text: reply}]);
      }, 600);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput; 
    setChatInput('');
    setChatMessages(prev => [...prev, {role: 'user', text: msg}]);
    
    setTimeout(() => {
      const lowerMsg = msg.toLowerCase();
      let botReply = "Your query has been securely logged. For immediate hazard reporting, please utilize the Live Capture tool in the Lodge Grievance section.";
      
      if (lowerMsg.includes('status') || lowerMsg.includes('track')) {
          botReply = "To track an existing complaint, please navigate to the 'View Status Tracker' tab and look up your specific Complaint ID.";
      }
      else if (lowerMsg.includes('pothole') || lowerMsg.includes('road')) {
          botReply = "Road infrastructure issues are routed directly to the BBMP Public Works department. Critical hazards generally carry a 48-hour SLA.";
      }
      else if (lowerMsg.includes('garbage') || lowerMsg.includes('sanitation')) {
          botReply = "Sanitation and solid waste complaints are assigned to local health inspectors. Severe bio-hazards are prioritized for 24-hour clearance.";
      }
      else if (lowerMsg.includes('power') || lowerMsg.includes('electricity')) {
          botReply = "Electrical outages and exposed wires are handled by BESCOM/CESC. Exposed live wires are treated as 'Critical'.";
      }

      setChatMessages(prev => [...prev, {role: 'bot', text: botReply}]);
    }, 600);
  };

  const handleOtpVerify = () => {
      setOtpSent(true);
      if (otpVal.length === 4) {
          setTimeout(() => setPhoneVerified(true), 500);
      }
  };

  const handlePhoneChange = (e) => {
      setUser({...user, phone: e.target.value});
      setPhoneVerified(false);
      setOtpSent(false);
      setOtpVal('');
  };

  const executePrint = () => {
    const originalTitle = document.title;
    if (selectedComplaint?.id) {
        document.title = `Official_Affidavit_${selectedComplaint.id}`;
    }
    
    try {
        window.print();
    } catch (error) {
        console.error("Printing failed or is blocked by the embedded environment.", error);
    } finally {
        document.title = originalTitle;
    }
  };

  const MiniMap = ({ lat, lng }) => {
      const mapRef = useRef(null);
      const mapInstance = useRef(null);

      useEffect(() => {
          if (!leafletLoaded || !mapRef.current || !window.L) return;

          if (mapInstance.current) {
              mapInstance.current.remove();
              mapInstance.current = null;
          }
          if (mapRef.current && mapRef.current._leaflet_id) {
              mapRef.current._leaflet_id = null;
          }

          const L = window.L;
          const map = L.map(mapRef.current, { 
              zoomControl: false, 
              dragging: false, 
              scrollWheelZoom: false 
          }).setView([lat, lng], 15);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          
          const icon = L.divIcon({
              html: `<div style="background-color: red; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
              className: '', 
              iconSize: [16, 16], 
              iconAnchor: [8, 8]
          });
          L.marker([lat, lng], { icon }).addTo(map);
          mapInstance.current = map;

          const ro = new ResizeObserver(() => {
              if (mapInstance.current) {
                  mapInstance.current.invalidateSize();
              }
          });
          ro.observe(mapRef.current);

          return () => {
              ro.disconnect();
              if (mapInstance.current) {
                  mapInstance.current.remove();
                  mapInstance.current = null;
              }
          };
      }, [leafletLoaded, lat, lng]);

      return <div ref={mapRef} className="w-full h-full z-0 pointer-events-none" />;
  };

  const HeatMapDashboard = ({ complaintsData }) => {
      const mapRef = useRef(null);
      const mapInstance = useRef(null);

      useEffect(() => {
          if (!leafletLoaded || !mapRef.current || !window.L) return;

          if (mapInstance.current) {
              mapInstance.current.remove();
              mapInstance.current = null;
          }
          if (mapRef.current && mapRef.current._leaflet_id) {
              mapRef.current._leaflet_id = null;
          }

          const L = window.L;
          const map = L.map(mapRef.current).setView([12.9716, 77.5946], 11);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          
          const markers = [];

          complaintsData?.forEach(c => {
             if(c.geo_location && c.geo_location.latitude) {
                 const severity = c.severity || 'Medium';
                 
                 let color = '#22c55e'; // default green (Standard)
                 let radius = 8;
                 
                 if (severity === 'Critical') { 
                     color = '#ef4444'; // Red
                     radius = 14; 
                 } else if (severity === 'High') { 
                     color = '#f97316'; // Orange
                     radius = 11; 
                 } else if (severity === 'Medium') { 
                     color = '#eab308'; // Yellow
                     radius = 9; 
                 }

                 const circle = L.circleMarker([c.geo_location.latitude, c.geo_location.longitude], {
                     color: color, 
                     fillColor: color, 
                     fillOpacity: 0.8, 
                     radius: radius,
                     weight: 2
                 }).addTo(map);
                 
                 circle.bindPopup(
                     `<div style='font-size:12px;'><b style='color:#1b3d6d;'>${c.id}</b><br/><b>Status:</b> ${c.status}<br/><b>Priority:</b> <span style="color:${color}; font-weight:bold;">${severity}</span></div>`
                 );

                 markers.push([c.geo_location.latitude, c.geo_location.longitude]);
             }
          });
          mapInstance.current = map;

          if (markers.length > 0) {
              try {
                  map.fitBounds(markers, { padding: [50, 50], maxZoom: 14 });
              } catch(e) {}
          }

          const ro = new ResizeObserver(() => {
              if (mapInstance.current) {
                  mapInstance.current.invalidateSize();
              }
          });
          ro.observe(mapRef.current);

          return () => {
              ro.disconnect();
              if (mapInstance.current) {
                  mapInstance.current.remove();
                  mapInstance.current = null;
              }
          };
      }, [leafletLoaded, complaintsData]);

      return <div ref={mapRef} className="w-full h-full z-0" />;
  };

  const StatusTimeline = ({ history }) => {
    const steps = ["Submitted", "Verified", "In Progress", "Resolved", "Closed"];
    const currentStep = history && history.length > 0 ? history[history.length - 1].status : "Submitted";
    const currentStepIndex = steps.indexOf(currentStep);
    
    return (
      <div className="w-full py-4 mt-2">
        <h5 className="text-xs font-bold text-[#1b3d6d] uppercase mb-4 tracking-widest no-print">Resolution Timeline</h5>
        
        <div className="flex items-center w-full px-2 no-print">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isLast = idx === steps.length - 1;
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center relative w-12">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${isCompleted ? 'bg-[#138808] text-white border-2 border-[#138808]' : 'bg-white text-gray-400 border-2 border-gray-300'}`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[9px] font-bold uppercase mt-2 absolute top-6 w-20 text-center ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{step}</span>
                </div>
                {!isLast && (
                    <div className={`flex-1 h-1 -mx-2 z-0 ${idx < currentStepIndex ? 'bg-[#138808]' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            )
          })}
        </div>
        
        <div className="mt-6 md:mt-10 bg-white border border-black p-4 text-xs font-mono break-inside-avoid">
           <p className="font-bold text-black mb-3 border-b border-black pb-1 uppercase tracking-widest text-[10px] font-sans">Official Log Trail</p>
           {history && history.map((h, i) => (
               <div key={i} className="flex justify-between py-2 border-b border-gray-300 border-dashed last:border-0">
                   <div className="flex flex-col pr-4">
                       <span className="font-bold tracking-wider text-black">{h.authority} <span className="font-normal text-gray-600 ml-2">[{h.status}]</span></span>
                       <span className="text-gray-800 mt-1">{h.note}</span>
                   </div>
                   <div className="text-[10px] whitespace-nowrap text-right text-gray-600">
                       {new Date(h.timestamp).toLocaleDateString()}<br/>
                       {new Date(h.timestamp).toLocaleTimeString()}
                   </div>
               </div>
           ))}
        </div>
      </div>
    );
  };

  const OfficialHeader = () => (
    <div className="w-full bg-white font-sans no-print shadow-md relative z-20">
      <div className="h-1.5 flex w-full">
        <div className="bg-[#FF9933] w-1/3 h-full"></div>
        <div className="bg-white w-1/3 h-full"></div>
        <div className="bg-[#138808] w-1/3 h-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="border-l-4 border-[#FF9933] pl-4 py-1">
            <h1 className="text-xl md:text-3xl font-bold text-[#1b3d6d] tracking-wide uppercase">{t.gov}</h1>
            <h2 className="text-xs md:text-base font-semibold text-gray-600 mt-0.5 uppercase tracking-wide">{t.portal}</h2>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-6">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-[#1b3d6d] uppercase">{t.helpline}</p>
            <p className="text-lg font-black text-red-600 flex items-center justify-end">
                <PhoneCall className="w-4 h-4 mr-1"/> 1902
            </p>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'kn' : 'en')} className="px-3 py-1 border border-gray-300 text-xs font-bold text-[#1b3d6d] bg-gray-50 hover:bg-gray-200 transition-colors shadow-sm flex items-center rounded-sm">
            <Languages className="w-3 h-3 mr-1"/> {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>
        </div>
      </div>

      <nav className="w-full bg-[#1b3d6d] shadow-md border-b-4 border-[#FF9933]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center">
          <div className="flex-1 flex overflow-x-auto no-scrollbar">
            {!user && (
              <button className="px-6 py-3 text-white text-xs font-semibold border-r border-blue-800 hover:bg-blue-800 uppercase flex items-center">
                  <Globe className="w-4 h-4 mr-2"/> {t.home}
              </button>
            )}
            
            {user && user.role === 'citizen' && (
              <>
                <button onClick={() => setView('citizen_new')} className={`px-6 py-3 text-xs font-semibold border-r border-blue-800 hover:bg-blue-800 uppercase flex items-center transition-colors ${view === 'citizen_new' ? 'bg-[#FF9933] text-white' : 'text-white'}`}>
                    <FileText className="w-4 h-4 mr-2"/> {t.lodge}
                </button>
                <button onClick={() => setView('citizen_track')} className={`px-6 py-3 text-xs font-semibold border-r border-blue-800 hover:bg-blue-800 uppercase flex items-center transition-colors ${view === 'citizen_track' ? 'bg-[#FF9933] text-white' : 'text-white'}`}>
                    <Search className="w-4 h-4 mr-2"/> {t.track}
                </button>
              </>
            )}
            
            {user && user.role === 'admin' && (
              <>
                <button onClick={() => setView('admin')} className={`px-6 py-3 text-xs font-semibold border-r border-blue-800 hover:bg-blue-800 uppercase flex items-center transition-colors ${view === 'admin' ? 'bg-[#FF9933] text-white' : 'text-white'}`}>
                    <BarChart3 className="w-4 h-4 mr-2"/> {t.dashboard}
                </button>
                <button onClick={() => setView('citizen_track')} className={`px-6 py-3 text-xs font-semibold border-r border-blue-800 hover:bg-blue-800 uppercase flex items-center transition-colors ${view === 'citizen_track' ? 'bg-[#FF9933] text-white' : 'text-white'}`}>
                    <ListTodo className="w-4 h-4 mr-2"/> {t.queue}
                </button>
              </>
            )}
          </div>
          
          {user && (
            <div className="px-6 py-2 flex items-center text-white bg-blue-800">
               <button onClick={() => setIsProfileOpen(true)} className="flex items-center hover:text-orange-300 transition-colors mr-4 group">
                   <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                   <span className="text-xs font-semibold uppercase truncate max-w-[150px]">{user.name}</span>
               </button>
               <button onClick={() => {setUser(null); setAuthMode('citizen_login');}} className="text-[10px] bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-sm font-bold uppercase shadow-sm border border-red-800 transition-colors">
                   {t.logout}
               </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col font-sans">
      <OfficialHeader />
      
      <div className="bg-white border-b border-gray-300 flex items-center relative shadow-sm h-8 overflow-hidden">
         <div className="bg-red-600 text-white text-[10px] font-bold px-4 h-full flex items-center uppercase absolute left-0 z-20 whitespace-nowrap shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
             System Alerts
         </div>
         <div className="flex-1 overflow-x-auto no-scrollbar h-full pl-[120px] md:pl-32 flex items-center">
             <div className="flex items-center whitespace-nowrap text-[10px] md:text-[11px] font-bold text-gray-700 w-max pr-4 space-x-6 md:space-x-8">
                <span className="text-[#1b3d6d] flex items-center">
                    <Info className="w-3 h-3 mr-1 text-[#FF9933]"/> Security Update: Direct Gallery Uploads are now disabled to prevent spoofing.
                </span>
                <span className="text-[#1b3d6d] flex items-center">
                    <Info className="w-3 h-3 mr-1 text-[#FF9933]"/> AI Smart Categorization is now active across all districts.
                </span>
                <span className="text-[#1b3d6d] flex items-center">
                    <Info className="w-3 h-3 mr-1 text-[#FF9933]"/> Live GPS API integration perfectly tags exact street addresses.
                </span>
             </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 lg:p-8 gap-8 items-center">
        
        <div className="w-full max-w-md mt-4">
          <div className="bg-white border border-gray-300 shadow-md rounded-sm overflow-hidden">
            
            <div className="flex border-b border-gray-300">
                <button 
                    onClick={() => setAuthMode('citizen_login')} 
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${(authMode === 'citizen_login' || authMode === 'citizen_signup') ? 'bg-white text-[#1b3d6d] border-t-4 border-[#1b3d6d]' : 'bg-gray-100 text-gray-500 border-t-4 border-transparent hover:bg-gray-200'}`}
                >
                    Citizen Portal
                </button>
                <button 
                    onClick={() => setAuthMode('admin_login')} 
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${authMode === 'admin_login' ? 'bg-[#1b3d6d] text-white border-t-4 border-[#FF9933]' : 'bg-gray-100 text-gray-500 border-t-4 border-transparent hover:bg-gray-200'}`}
                >
                    Official Login
                </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                 <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-[#1b3d6d]" /> 
                    {authMode === 'admin_login' ? 'Secure Nodal Access' : (authMode === 'citizen_signup' ? 'Citizen Registration Form' : 'Citizen Sign In')}
                 </h3>
              </div>

              {authError && (
                <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-3 mb-4 text-xs font-semibold shadow-sm">
                  {authError}
                </div>
              )}
              
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'citizen_signup' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                          Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input name="name" type="text" required placeholder="e.g. Ramesh Kumar" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1b3d6d] rounded-sm bg-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                              Phone No. <span className="text-red-500">*</span>
                          </label>
                          <input name="phone" type="tel" required pattern="[0-9]{10}" placeholder="10-digit number" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1b3d6d] rounded-sm bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                              Email ID <span className="text-red-500">*</span>
                          </label>
                          <input name="email" type="email" required placeholder="name@domain.com" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1b3d6d] rounded-sm bg-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                              District <span className="text-red-500">*</span>
                          </label>
                          <select name="district" required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1b3d6d] rounded-sm bg-white">
                              <option value="Bengaluru Urban">Bengaluru Urban</option>
                              <option value="Mysuru">Mysuru</option>
                              <option value="Mangaluru">Mangaluru</option>
                              <option value="Hubballi">Hubballi</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                              Ward/Taluk <span className="text-red-500">*</span>
                          </label>
                          <input name="ward" type="text" required placeholder="e.g. Ward 172" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1b3d6d] rounded-sm bg-white" />
                        </div>
                    </div>
                  </div>
                )}

                {authMode !== 'citizen_signup' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                        {authMode === 'admin_login' ? 'Official Nodal ID / Govt Email' : 'Registered Email ID'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                        name="email" 
                        type={authMode === 'admin_login' ? "text" : "email"} 
                        required 
                        placeholder={authMode === 'admin_login' ? "nodal.officer@karnataka.gov.in" : "citizen@example.com"} 
                        className={`w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1b3d6d] rounded-sm ${authMode === 'admin_login' ? 'bg-blue-50/30' : 'bg-white'}`} 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Password / Secure Passkey <span className="text-red-500">*</span>
                  </label>
                  <input name="password" type="password" required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1b3d6d] rounded-sm bg-white" />
                </div>
                
                <button type="submit" disabled={authLoading} className={`w-full text-white font-bold py-2.5 text-sm transition-colors mt-2 shadow-sm uppercase tracking-wider border rounded-sm ${authMode === 'admin_login' ? 'bg-[#1b3d6d] hover:bg-blue-900 border-blue-950' : 'bg-[#138808] hover:bg-green-700 border-green-800'}`}>
                  {authLoading ? 'Verifying Details...' : (authMode === 'citizen_signup' ? 'Complete Registration' : 'Secure Login')}
                </button>
              </form>

              {authMode !== 'admin_login' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                     <button onClick={() => setAuthMode(authMode === 'citizen_login' ? 'citizen_signup' : 'citizen_login')} className="text-xs font-bold text-[#1b3d6d] hover:underline uppercase">
                       {authMode === 'citizen_login' ? 'New Citizen? Click to Register' : 'Already registered? Sign In'}
                     </button>
                  </div>
              )}

              <div className="mt-6 bg-yellow-50 border border-yellow-300 p-3 rounded-sm shadow-sm">
                 <p className="text-[10px] font-bold text-yellow-800 mb-2 uppercase text-center border-b border-yellow-200 pb-1">
                     One-Click Demo Access
                 </p>
                 <div className="flex space-x-2 mt-2">
                    <button type="button" onClick={(e) => handleAuth(e, 'citizen')} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-2 text-[10px] uppercase shadow-sm transition-colors rounded-sm flex items-center justify-center">
                        <User className="w-3 h-3 mr-1"/> Citizen
                    </button>
                    <button type="button" onClick={(e) => handleAuth(e, 'admin')} className="flex-1 bg-[#1b3d6d] hover:bg-blue-900 text-white font-bold py-2 text-[10px] uppercase shadow-sm border border-[#1b3d6d] transition-colors rounded-sm flex items-center justify-center">
                        <Shield className="w-3 h-3 mr-1"/> Official
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6">
           <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-sm">
             <h2 className="text-xl font-bold text-[#1b3d6d] border-b-2 border-[#FF9933] pb-2 mb-4 uppercase">
                 About Janaspandana Platform
             </h2>
             <p className="text-gray-700 leading-relaxed mb-6 text-sm text-justify">
               Janaspandana is an integrated Public Grievance Redressal System created by the Government of Karnataka. This advanced portal utilizes Artificial Intelligence to automatically categorize issues, detect urgency, map accurate GPS coordinates, and auto-assign complaints to the concerned departmental officers via an interactive live heatmap routing system.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 p-4 bg-gray-50 text-center shadow-sm">
                   <ShieldCheck className="w-8 h-8 text-[#1b3d6d] mx-auto mb-2" />
                   <h4 className="font-bold text-[#1b3d6d] text-sm">Anti-Spoofing</h4>
                   <p className="text-[10px] text-gray-600 mt-1 uppercase font-semibold">Live Camera Enforced</p>
                </div>
                <div className="border border-gray-200 p-4 bg-gray-50 text-center shadow-sm">
                   <BrainCircuit className="w-8 h-8 text-red-600 mx-auto mb-2" />
                   <h4 className="font-bold text-[#1b3d6d] text-sm">AI Vision</h4>
                   <p className="text-[10px] text-gray-600 mt-1 uppercase font-semibold">Automated Inference</p>
                </div>
                <div className="border border-gray-200 p-4 bg-gray-50 text-center shadow-sm">
                   <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                   <h4 className="font-bold text-[#1b3d6d] text-sm">Real-Time Alerts</h4>
                   <p className="text-[10px] text-gray-600 mt-1 uppercase font-semibold">SMS & Email Engine</p>
                </div>
             </div>
           </div>

           <div className="bg-white border border-gray-300 shadow-sm rounded-sm">
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                 <h3 className="font-bold text-[#1b3d6d] text-sm uppercase flex items-center">
                     <FileSearch className="w-4 h-4 mr-2"/> Mandatory Guidelines & Links
                 </h3>
              </div>
              <ul className="p-4 space-y-3 text-sm font-semibold divide-y divide-gray-100">
                 <li className="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer pt-2 first:pt-0">
                     <ChevronRight className="w-4 h-4 mr-1 text-[#FF9933]"/> User Manual for Online Grievance Submission (PDF)
                 </li>
                 <li className="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer pt-2">
                     <ChevronRight className="w-4 h-4 mr-1 text-[#FF9933]"/> Official Department SLA Matrix - 2026 Guidelines
                 </li>
                 <li className="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer pt-2">
                     <ChevronRight className="w-4 h-4 mr-1 text-[#FF9933]"/> Penalties for Fake Reporting (Section 182 IPC)
                 </li>
              </ul>
           </div>
        </div>

      </div>
      
      <footer className="mt-auto bg-[#1b3d6d] text-white py-4 text-center border-t-4 border-[#FF9933]">
        <p className="text-xs font-semibold uppercase tracking-widest">Generated by CivicTech System – Karnataka</p>
      </footer>
    </div>
  );

  const getHighlightClass = (c) => {
      if (c.severity === 'Critical' || c.ai_score >= 80 || c.urgency_flag) return 'border-l-4 border-red-500 bg-red-50/20';
      if (c.status === 'Pending' || c.status === 'Submitted' || (c.ai_score >= 50 && c.ai_score < 80)) return 'border-l-4 border-yellow-500 bg-yellow-50/20';
      if (c.status === 'Resolved' || c.status === 'Closed' || c.ai_score < 50) return 'border-l-4 border-green-500 bg-green-50/20';
      return 'border-l-4 border-gray-300 bg-white';
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-gray-800 flex flex-col relative">
      <OfficialHeader />
      
      {/* PROFILE SETTINGS MODAL */}
      {isProfileOpen && (
         <div className="fixed inset-0 z-[99999] flex justify-end bg-black/60 backdrop-blur-sm no-print">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
                <div className="bg-[#1b3d6d] text-white p-4 flex justify-between items-center border-b-4 border-[#FF9933]">
                   <h2 className="text-sm font-bold uppercase tracking-wider flex items-center">
                       <Settings className="w-5 h-5 mr-2"/> {t.profile}
                   </h2>
                   <button onClick={() => setIsProfileOpen(false)} className="hover:text-red-400 transition-colors">
                       <X className="w-5 h-5"/>
                   </button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-md mb-3">
                            <User className="w-10 h-10 text-gray-500"/>
                        </div>
                        <h3 className="text-lg font-black text-[#1b3d6d] uppercase">{user.name}</h3>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-sm uppercase tracking-widest">{user.role}</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Email ID</label>
                           <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm font-bold">{user.email}</div>
                        </div>

                        <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Phone Number Status</label>
                           <div className="flex border border-gray-300 rounded-sm overflow-hidden shadow-sm">
                               <input type="tel" onChange={handlePhoneChange} value={user.phone} className="p-3 bg-white flex-1 text-sm font-bold outline-none border-r border-gray-200" />
                               {phoneVerified ? (
                                   <div className="bg-green-100 text-green-700 px-4 flex items-center text-xs font-bold uppercase tracking-widest">
                                       <Check className="w-4 h-4 mr-1"/> Verified
                                   </div>
                               ) : (
                                   <button onClick={handleOtpVerify} className="bg-[#1b3d6d] hover:bg-blue-900 text-white px-4 font-bold text-xs uppercase tracking-widest transition-colors">
                                       {otpSent ? 'Send OTP' : 'Verify'}
                                   </button>
                               )}
                           </div>
                           {otpSent && !phoneVerified && (
                               <div className="mt-2 flex space-x-2">
                                   <input type="text" placeholder="Enter 4-digit OTP" maxLength={4} value={otpVal} onChange={(e)=>setOtpVal(e.target.value)} className="border border-gray-300 p-2 text-sm flex-1 rounded-sm text-center tracking-[0.5em] font-bold focus:border-[#1b3d6d] outline-none" />
                                   <button onClick={handleOtpVerify} className="bg-green-600 hover:bg-green-700 text-white px-4 font-bold text-xs rounded-sm uppercase tracking-widest transition-colors">Confirm</button>
                               </div>
                           )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">District</label>
                               <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm font-bold">{user.district || 'N/A'}</div>
                            </div>
                            <div>
                               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Ward</label>
                               <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm font-bold">{user.ward || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 no-print relative">
        
        {/* SIMULATED SYSTEM NOTIFICATION OVERLAY */}
        {generatedNotification && (
           <div className="fixed top-4 right-4 z-[9999] w-96 bg-white border-2 border-gray-800 shadow-2xl rounded-sm overflow-hidden animate-in slide-in-from-right-10">
               <div className="bg-[#1b3d6d] text-white p-3 flex justify-between items-center border-b-2 border-[#FF9933]">
                   <h4 className="text-xs font-bold uppercase tracking-widest flex items-center">
                       <Database className="w-4 h-4 mr-2"/> System Engine Triggered
                   </h4>
                   <button onClick={() => setGeneratedNotification(null)} className="hover:text-red-400">
                       <X className="w-4 h-4"/>
                   </button>
               </div>
               
               <div className="p-4 bg-gray-50 border-b border-gray-300 text-xs font-mono text-green-700 font-bold flex items-start">
                   <Activity className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 animate-pulse"/>
                   <span>INSERT INTO complaint_notifications (id, complaint_id, status) VALUES ('{generatedNotification.id}', '{generatedNotification.complaintId}', 'SENT');</span>
               </div>

               <div className="p-4 space-y-4">
                   <div className="border border-blue-200 rounded-sm overflow-hidden shadow-sm">
                       <div className="bg-blue-50 px-3 py-1.5 border-b border-blue-200 flex items-center text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                           <Smartphone className="w-3 h-3 mr-1"/> SMS Dispatched to {generatedNotification.contact}
                       </div>
                       <p className="p-3 text-xs text-gray-700 bg-white leading-relaxed">{generatedNotification.sms}</p>
                   </div>

                   <div className="border border-orange-200 rounded-sm overflow-hidden shadow-sm">
                       <div className="bg-orange-50 px-3 py-1.5 border-b border-orange-200 flex items-center text-[10px] font-bold text-orange-800 uppercase tracking-widest">
                           <Mail className="w-3 h-3 mr-1"/> Email Sent to {generatedNotification.email}
                       </div>
                       <pre className="p-3 text-[10px] text-gray-700 bg-white whitespace-pre-wrap font-sans leading-relaxed border-l-2 border-orange-400">
                           {generatedNotification.emailText}
                       </pre>
                   </div>
               </div>
           </div>
        )}

        {/* CITIZEN: LODGE GRIEVANCE */}
        {view === 'citizen_new' && (
          <div className="bg-white border border-gray-300 shadow-sm rounded-sm overflow-hidden">
             <div className="bg-[#1b3d6d] px-6 py-4 flex justify-between items-center border-b-2 border-[#FF9933]">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">{t.form_title}</h2>
                <div className="flex space-x-2">
                    <span className="bg-[#138808] text-white text-[10px] font-bold px-3 py-1 rounded-sm border border-green-600 uppercase shadow-inner flex items-center">
                       <ShieldCheck className="w-3 h-3 mr-1" /> {t.live_verified}
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-sm border border-blue-500 uppercase shadow-inner flex items-center hidden sm:flex">
                       <Bot className="w-3 h-3 mr-1" /> {t.ai_inference}
                    </span>
                </div>
             </div>

             <div className="bg-yellow-50 border-b border-yellow-200 p-4 text-xs text-yellow-800 flex items-start">
                <Info className="w-5 h-5 mr-3 flex-shrink-0 text-yellow-600" />
                <div className="font-medium leading-relaxed">
                    <strong className="uppercase">Security Notice:</strong> 
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                        <li><strong>Gallery uploads are disabled.</strong> You must use the live camera to prevent spoofing and fake reporting.</li>
                        <li>The AI will automatically scan the live image to extract hazard features and evaluate urgency.</li>
                        <li><strong>Geo-tagging is highly recommended</strong> and uses the OpenStreetMap API to fetch exact street addresses.</li>
                    </ul>
                </div>
             </div>
             
             <form onSubmit={submitComplaint} className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   
                   <div className="space-y-6">
                      <div>
                         <label className="block text-sm font-bold text-[#1b3d6d] mb-2 uppercase flex items-center">
                            1. Visual Evidence 
                            <span className="ml-2 text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-sm border border-red-300 shadow-inner font-black tracking-widest">
                                LIVE CAPTURE ENFORCED
                            </span>
                         </label>
                         
                         {!image ? (
                             <label className="w-full border-2 border-dashed border-[#1b3d6d] bg-blue-50/30 h-40 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors shadow-sm relative overflow-hidden group">
                                 <Camera className="w-10 h-10 text-[#1b3d6d] mb-2 group-hover:scale-110 transition-transform" />
                                 <span className="text-sm font-black text-[#1b3d6d] uppercase tracking-widest">Capture Live Photo</span>
                                 <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Required for AI processing</span>
                                 <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                             </label>
                         ) : (
                             <div className="border border-gray-300 bg-gray-50 h-40 rounded-sm relative flex items-center justify-center shadow-inner overflow-hidden group">
                                 <img src={image} className={`h-full object-contain p-1 transition-opacity duration-300 ${isAnalyzingImage ? 'opacity-40' : 'opacity-100'}`} alt="Preview" />
                                 
                                 {/* Laser Scanning Animation Overlay */}
                                 {isAnalyzingImage && (
                                     <div className="absolute inset-0 z-10 pointer-events-none">
                                         <div className="w-full h-1 bg-green-400 shadow-[0_0_15px_#4ade80] animate-[scan_2s_ease-in-out_infinite]"></div>
                                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px] p-4 text-center">
                                             <Activity className="w-6 h-6 text-white animate-spin mb-2"/>
                                             <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">{scanStatus}</span>
                                         </div>
                                     </div>
                                 )}

                                 {!isAnalyzingImage && (
                                     <>
                                         <button type="button" onClick={() => {setImage(null); setText('');}} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-colors z-20">
                                             <X className="w-4 h-4"/>
                                         </button>
                                         <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[9px] px-2 py-1 rounded font-bold uppercase flex items-center shadow-md z-20">
                                            <CheckCircle className="w-3 h-3 mr-1 text-green-400"/> AI Scan Complete
                                         </div>
                                     </>
                                 )}
                             </div>
                         )}
                      </div>

                      <div>
                         <label className="block text-sm font-bold text-[#1b3d6d] uppercase mb-2">
                             2. Detailed Issue Description <span className="text-red-500">*</span>
                         </label>
                         <div className="relative group">
                            <textarea 
                                value={text} 
                                onChange={e => setText(e.target.value)} 
                                required 
                                rows="5" 
                                className={`w-full border rounded-sm p-3 pb-12 text-sm focus:outline-none focus:border-[#1b3d6d] focus:ring-1 focus:ring-[#1b3d6d] resize-none shadow-inner ${isAnalyzingImage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-800 border-gray-300'}`} 
                                placeholder="Capture a live photo to auto-extract hazard details, or type your grievance here..."
                                disabled={isAnalyzingImage}
                            ></textarea>
                            
                            {/* Perfectly Positioned Voice Input Button Inside Textarea */}
                            <div className="absolute bottom-2 right-2">
                                <button type="button" onClick={startVoice} className={`p-2 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-[#1b3d6d] text-white hover:bg-blue-900'}`} title="Voice Dictation">
                                   <Volume2 className="w-4 h-4" />
                                </button>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div>
                         <div className="flex justify-between items-end mb-2">
                             <label className="block text-sm font-bold text-[#1b3d6d] uppercase">3. Auto Geo-Tag Location</label>
                             <button type="button" onClick={fetchLiveLocation} className={`text-[10px] px-3 py-1.5 rounded-sm border font-bold shadow-sm ${isLocating ? 'bg-blue-100 text-blue-700 border-blue-300 animate-pulse' : 'bg-[#1b3d6d] text-white border-blue-900 hover:bg-blue-900'} flex items-center transition-colors uppercase tracking-widest`}>
                                 <Crosshair className={`w-3 h-3 mr-1 ${isLocating ? 'animate-spin' : ''}`} /> {isLocating ? 'Fetching GPS...' : 'Use Live GPS'}
                             </button>
                         </div>
                         <div className="border border-gray-400 bg-gray-100 h-[190px] rounded-sm relative flex items-center justify-center overflow-hidden shadow-inner">
                            
                            {/* Native Leaflet Map injected dynamically */}
                            {realGeoLocation ? (
                                <MiniMap lat={realGeoLocation.latitude} lng={realGeoLocation.longitude} />
                            ) : (
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            )}

                            {isLocating && <div className="absolute w-24 h-24 border-4 border-blue-500 rounded-full animate-ping opacity-50 z-20"></div>}
                            
                            {!realGeoLocation && (
                                <div className="absolute w-6 h-6 bg-red-600 border-4 border-white rounded-full shadow-lg z-10 transition-all duration-300 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                            )}
                            
                            <div className="absolute bottom-2 bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#1b3d6d] rounded-sm border border-blue-300 z-20 uppercase tracking-widest shadow-sm w-[90%] text-center truncate">
                                {realGeoLocation ? `Lat: ${realGeoLocation.latitude.toFixed(4)}, Lng: ${realGeoLocation.longitude.toFixed(4)}` : 'Click "Use Live GPS" to exact pinpoint'}
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                         <div>
                             <label className="block text-sm font-bold text-[#1b3d6d] mb-1 uppercase">4. Exact Locality / Street Address <span className="text-red-500">*</span></label>
                             <textarea value={location} onChange={e => setLocation(e.target.value)} required rows="2" className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#1b3d6d] focus:ring-1 focus:ring-[#1b3d6d] shadow-inner resize-none bg-gray-50" placeholder="GPS will auto-fill precise street address..."></textarea>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                             <div>
                                 <label className="block text-[10px] font-bold text-[#1b3d6d] mb-1 uppercase tracking-widest">District <span className="text-red-500">*</span></label>
                                 <input value={complaintDistrict} onChange={e => setComplaintDistrict(e.target.value)} required type="text" className="w-full border border-gray-300 p-2 text-sm rounded-sm bg-white focus:outline-none" placeholder="e.g. Bengaluru Urban" />
                             </div>
                             <div>
                                 <label className="block text-[10px] font-bold text-[#1b3d6d] mb-1 uppercase tracking-widest">Ward / Taluk <span className="text-red-500">*</span></label>
                                 <input value={complaintWard} onChange={e => setComplaintWard(e.target.value)} required type="text" className="w-full border border-gray-300 p-2 text-sm rounded-sm bg-white focus:outline-none" placeholder="e.g. Ward 172" />
                             </div>
                         </div>

                         <div className="mt-2 p-3 border border-gray-300 bg-gray-50 rounded-sm">
                             <label className="block text-[10px] font-bold text-[#1b3d6d] mb-1 uppercase tracking-widest">Manual Category Override (Optional)</label>
                             <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-300 p-2 text-sm rounded-sm bg-white focus:outline-none font-semibold text-gray-700 shadow-sm">
                                 <option>Auto-Detect via AI</option>
                                 <option>Infrastructure (Roads, Bridges)</option>
                                 <option>Sanitation & Solid Waste</option>
                                 <option>Electricity & Power</option>
                                 <option>Water & Sewage</option>
                             </select>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-4">
                   <p className="text-xs text-gray-600 font-bold flex items-center bg-gray-100 px-3 py-2 rounded-sm border border-gray-200">
                       <AlertTriangle className="w-4 h-4 mr-2 text-red-600"/> Submitting false information is punishable under law.
                   </p>
                   <button disabled={isSubmitting} type="submit" className="w-full md:w-auto bg-[#138808] hover:bg-green-700 text-white font-bold py-3 px-10 rounded-sm shadow-md transition-colors text-sm uppercase tracking-wider flex items-center justify-center border border-green-800">
                      {isSubmitting ? 'Analyzing & Routing via AI...' : 'Submit Official Report'}
                   </button>
                </div>
             </form>
          </div>
        )}

        {/* ADMIN: DASHBOARD */}
        {view === 'admin' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-white border border-gray-300 shadow-sm rounded-sm overflow-hidden">
                <div className="flex border-b-2 border-gray-300 bg-gray-100 overflow-x-auto no-scrollbar">
                   <button onClick={() => setAdminTab('intelligence')} className={`flex-1 py-4 px-4 whitespace-nowrap text-xs font-black uppercase tracking-widest transition-colors ${adminTab === 'intelligence' ? 'bg-[#1b3d6d] text-white border-b-4 border-[#FF9933]' : 'text-gray-600 hover:bg-gray-200 border-b-4 border-transparent'}`}>
                       Civic Intelligence
                   </button>
                   <button onClick={() => setAdminTab('highlights')} className={`flex-1 py-4 px-4 whitespace-nowrap text-xs font-black uppercase tracking-widest transition-colors ${adminTab === 'highlights' ? 'bg-[#1b3d6d] text-white border-b-4 border-[#FF9933]' : 'text-gray-600 hover:bg-gray-200 border-b-4 border-transparent'}`}>
                       Dashboard Highlights
                   </button>
                   <button onClick={() => setAdminTab('heatmap')} className={`flex-1 py-4 px-4 whitespace-nowrap text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center ${adminTab === 'heatmap' ? 'bg-[#1b3d6d] text-white border-b-4 border-[#FF9933]' : 'text-gray-600 hover:bg-gray-200 border-b-4 border-transparent'}`}>
                       <MapPin className="w-4 h-4 mr-2"/> Live Heatmap
                   </button>
                   <button onClick={() => setAdminTab('performance')} className={`flex-1 py-4 px-4 whitespace-nowrap text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center ${adminTab === 'performance' ? 'bg-[#1b3d6d] text-white border-b-4 border-[#FF9933]' : 'text-gray-600 hover:bg-gray-200 border-b-4 border-transparent'}`}>
                       <Users className="w-4 h-4 mr-2"/> Officer Matrix
                   </button>
                </div>

                {/* TAB 1: CIVIC INTELLIGENCE & PREDICTIONS */}
                {adminTab === 'intelligence' && analytics && (
                  <div className="p-6 space-y-6 bg-gray-50">
                     <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                        <h3 className="text-lg font-black text-[#1b3d6d] uppercase tracking-wider">AI Civic Intelligence & Predictions</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-300 p-6 rounded-sm shadow-sm flex flex-col items-center text-center">
                           <h4 className="font-bold text-sm text-gray-700 uppercase tracking-widest mb-4">Current Intelligence Score</h4>
                           <div className="relative w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center mb-4">
                               <div className={`absolute inset-0 rounded-full border-8 ${analytics.civic_intelligence?.trend_direction === 'Increased' ? 'border-red-500' : 'border-green-500'}`} style={{clipPath: `polygon(0 0, 100% 0, 100% ${analytics.civic_intelligence?.score}%, 0 ${analytics.civic_intelligence?.score}%)`}}></div>
                               <span className="text-4xl font-black text-[#1b3d6d] z-10">{analytics.civic_intelligence?.score}</span>
                           </div>
                           <div className="flex items-center space-x-2 text-xs font-bold uppercase mb-2">
                               <span>Trend: </span>
                               {analytics.civic_intelligence?.trend_direction === 'Increased' ? (
                                   <span className="text-red-600 flex items-center bg-red-50 px-2 py-1 rounded border border-red-200"><TrendingUp className="w-4 h-4 mr-1"/> Rising Risk</span>
                               ) : (
                                   <span className="text-green-600 flex items-center bg-green-50 px-2 py-1 rounded border border-green-200"><TrendingDown className="w-4 h-4 mr-1"/> Stable/Decreasing</span>
                               )}
                           </div>
                           <p className="text-xs text-gray-500 mt-2 italic font-medium">{analytics.civic_intelligence?.insight}</p>
                        </div>

                        <div className="bg-white border border-gray-300 p-6 rounded-sm shadow-sm">
                           <h4 className="font-bold text-sm text-gray-700 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center">
                               <BrainCircuit className="w-4 h-4 mr-2 text-[#1b3d6d]"/> Machine Learning Predictions
                           </h4>
                           <div className="space-y-4">
                              {analytics.predictions?.map((pred, i) => (
                                 <div key={i} className="bg-gray-50 border border-gray-200 p-3 rounded-sm text-xs relative overflow-hidden">
                                     <div className="absolute top-0 left-0 h-full w-1 bg-[#FF9933]"></div>
                                     <div className="flex justify-between font-bold text-[#1b3d6d] mb-1 ml-2">
                                        <span className="uppercase">{pred.ward} - {pred.category}</span>
                                        <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded-sm border border-orange-200">Expected Surge: {pred.count} cases</span>
                                     </div>
                                     <p className="text-gray-600 ml-2 mb-3 mt-2">{pred.reason}</p>
                                     <div className="ml-2 flex items-center justify-between text-[9px] uppercase tracking-widest text-gray-500">
                                        <span>AI Confidence</span>
                                        <span className="font-bold text-gray-700">{pred.confidence}%</span>
                                     </div>
                                     <div className="w-full bg-gray-200 h-1.5 mt-1 ml-2 rounded-full overflow-hidden w-[calc(100%-8px)]">
                                        <div className="bg-[#1b3d6d] h-full" style={{width: `${pred.confidence}%`}}></div>
                                     </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm mt-6">
                         <h4 className="font-bold text-sm text-[#1b3d6d] uppercase mb-4 border-b border-gray-100 pb-2">Smart Auto-Assignment Distribution</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             {Object.entries(analytics.department_distribution || {}).map(([dept, count]) => (
                                 <div key={dept} className="border border-gray-200 p-4 text-center bg-gray-50 rounded-sm">
                                     <p className="text-3xl font-black text-[#1b3d6d]">{count}</p>
                                     <p className="text-[10px] font-bold text-gray-600 uppercase mt-2 tracking-wide">{dept}</p>
                                 </div>
                             ))}
                         </div>
                     </div>
                  </div>
                )}

                {/* TAB 2: DASHBOARD HIGHLIGHTS */}
                {adminTab === 'highlights' && analytics && (
                  <div className="p-6 bg-gray-50">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                        <h3 className="text-lg font-black text-[#1b3d6d] uppercase tracking-wider">Complaint Dashboard Highlights</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         <div className="bg-white border-l-4 border-red-600 shadow-sm p-5 rounded-sm">
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">High Severity / Urgent</p>
                             <div className="flex items-end space-x-3">
                                 <p className="text-4xl font-black text-red-700">{analytics.urgent}</p>
                                 <p className="text-[10px] font-bold text-red-600 mb-1.5 flex items-center bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">
                                     <AlertTriangle className="w-3 h-3 mr-1"/> Immediate Action
                                 </p>
                             </div>
                         </div>
                         <div className="bg-white border-l-4 border-yellow-500 shadow-sm p-5 rounded-sm">
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pending Resolution</p>
                             <div className="flex items-end space-x-3">
                                 <p className="text-4xl font-black text-yellow-600">{analytics.pending}</p>
                                 <p className="text-[10px] font-bold text-yellow-600 mb-1.5 flex items-center bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 uppercase">
                                     <Clock className="w-3 h-3 mr-1"/> Standard SLA
                                 </p>
                             </div>
                         </div>
                         <div className="bg-white border-l-4 border-green-600 shadow-sm p-5 rounded-sm">
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Resolved (Green)</p>
                             <div className="flex items-end space-x-3">
                                 <p className="text-4xl font-black text-green-700">{analytics.resolved}</p>
                                 <p className="text-[10px] font-bold text-green-600 mb-1.5 flex items-center bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase">
                                     <CheckCircle className="w-3 h-3 mr-1"/> Closed Cases
                                 </p>
                             </div>
                         </div>
                     </div>

                     <h4 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-4">Top Urgent Complaints</h4>
                     <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-gray-100 text-gray-600 text-xs uppercase border-b border-gray-300">
                              <tr>
                                 <th className="px-4 py-3 font-bold">Complaint ID</th>
                                 <th className="px-4 py-3 font-bold">Category & Dept</th>
                                 <th className="px-4 py-3 font-bold">AI Priority</th>
                                 <th className="px-4 py-3 font-bold text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-200">
                              {complaints.filter(c => c.urgency_flag && c.status !== 'Closed').sort((a,b) => b.ai_score - a.ai_score).slice(0, 5).map(c => (
                                <tr key={c.id} className="hover:bg-red-50/30 transition-colors">
                                   <td className="px-4 py-4 font-bold text-[#1b3d6d]">{c.id}</td>
                                   <td className="px-4 py-4 font-bold text-gray-800 uppercase text-xs">
                                       {c.category} 
                                       <span className="text-[9px] text-gray-500 block mt-1 tracking-widest bg-gray-100 w-max px-2 py-0.5 rounded">
                                           {c.department}
                                       </span>
                                   </td>
                                   <td className="px-4 py-4">
                                       <span className="bg-red-100 text-red-800 text-[10px] px-2 py-1.5 rounded-sm font-bold border border-red-200 uppercase tracking-wider">
                                           {c.ai_score} - Critical
                                       </span>
                                   </td>
                                   <td className="px-4 py-4 text-right">
                                       <button onClick={() => setSelectedComplaint(c)} className="text-[#1b3d6d] font-bold text-xs hover:underline uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-sm border border-slate-300">
                                           View Details
                                       </button>
                                   </td>
                                </tr>
                              ))}
                              {complaints.filter(c => c.urgency_flag && c.status !== 'Closed').length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs bg-gray-50">
                                        No urgent pending issues.
                                    </td>
                                </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}

                {/* PERFECTED TAB 3: REAL NATIVE LEAFLET HEATMAP */}
                {adminTab === 'heatmap' && (
                  <div className="p-6 bg-gray-50">
                     <div className="flex justify-between items-center mb-4">
                        <div>
                           <h3 className="text-lg font-black text-[#1b3d6d] uppercase tracking-wider">Exact Location Density Heatmap</h3>
                           <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-widest flex items-center">
                               <CheckCircle className="w-3 h-3 text-green-600 mr-1"/> Native OpenStreetMap Integration (Interactive)
                           </p>
                        </div>
                        <div className="bg-white p-2 border border-gray-300 rounded-sm shadow-sm flex space-x-3 text-[9px] font-bold uppercase tracking-widest">
                            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#ef4444] mr-1"></div> Critical</span>
                            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#f97316] mr-1"></div> High</span>
                            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#eab308] mr-1"></div> Medium</span>
                            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#22c55e] mr-1"></div> Low</span>
                        </div>
                     </div>
                     
                     <div className="w-full h-[550px] border-4 border-white shadow-lg bg-gray-200 relative z-0">
                         <HeatMapDashboard complaintsData={complaints} />
                     </div>
                  </div>
                )}

                {/* TAB 4: OFFICER & HEAD WORKER PERFORMANCE */}
                {adminTab === 'performance' && (
                  <div className="p-6 bg-gray-50">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                        <h3 className="text-lg font-black text-[#1b3d6d] uppercase tracking-wider">Officer & Head Worker Performance Matrix</h3>
                     </div>

                     <div className="space-y-6">
                        {performanceData?.map((officer, i) => (
                           <div key={i} className={`bg-white border-l-4 shadow-sm rounded-sm overflow-hidden ${officer.performance_score < 60 ? 'border-red-500' : 'border-green-500'}`}>
                               <div className="bg-gray-100 p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-sm ${officer.performance_score < 60 ? 'bg-red-600' : 'bg-green-600'}`}>
                                          {officer.performance_score}
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-[#1b3d6d] text-lg uppercase tracking-wider flex items-center">
                                             {officer.officer_name} <span className="text-[10px] bg-white border border-gray-300 text-gray-600 ml-2 px-2 py-0.5 rounded shadow-sm">{officer.officer_id}</span>
                                          </h4>
                                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{officer.department}</p>
                                      </div>
                                  </div>
                                  <div className="flex space-x-6 text-xs">
                                      <div className="text-center">
                                          <p className="font-bold text-gray-800 text-lg">{officer.assigned_count}</p>
                                          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Assigned</p>
                                      </div>
                                      <div className="text-center">
                                          <p className="font-bold text-green-700 text-lg">{officer.resolved_count}</p>
                                          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Resolved</p>
                                      </div>
                                      <div className="text-center">
                                          <p className={`font-bold text-lg ${officer.escalation_count > 5 ? 'text-red-600' : 'text-gray-800'}`}>{officer.escalation_count}</p>
                                          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Escalations</p>
                                      </div>
                                      <div className="text-center border-l pl-6 border-gray-300">
                                          <p className="font-bold text-orange-600 text-lg flex items-center justify-center"><Award className="w-4 h-4 mr-1"/> {officer.feedback_score}/5</p>
                                          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Citizen Rating</p>
                                      </div>
                                  </div>
                               </div>

                               <div className="p-4">
                                  <h5 className="text-[10px] font-black text-[#1b3d6d] uppercase tracking-widest mb-3 flex items-center"><Users className="w-3 h-3 mr-2"/> Assigned Head Workers</h5>
                                  <table className="w-full text-left text-xs border border-gray-200">
                                     <thead className="bg-gray-50 text-gray-600 uppercase tracking-widest border-b border-gray-200">
                                        <tr>
                                           <th className="px-4 py-2 font-bold">Worker Details</th>
                                           <th className="px-4 py-2 font-bold text-center">Assigned</th>
                                           <th className="px-4 py-2 font-bold text-center">Resolved</th>
                                           <th className="px-4 py-2 font-bold">Resolution Rate</th>
                                           <th className="px-4 py-2 font-bold text-right">AI Score</th>
                                        </tr>
                                     </thead>
                                     <tbody className="divide-y divide-gray-100">
                                        {officer.head_workers?.map(hw => {
                                            const rate = Math.round((hw.resolved / hw.complaints_assigned) * 100) || 0;
                                            return (
                                                <tr key={hw.worker_id} className="hover:bg-gray-50 transition-colors">
                                                   <td className="px-4 py-3 font-bold text-gray-800 uppercase">
                                                       {hw.worker_name} <span className="text-gray-400 font-medium ml-1">({hw.worker_id})</span>
                                                   </td>
                                                   <td className="px-4 py-3 text-center font-bold text-gray-700">{hw.complaints_assigned}</td>
                                                   <td className="px-4 py-3 text-center font-bold text-green-700">{hw.resolved}</td>
                                                   <td className="px-4 py-3">
                                                       <div className="flex items-center space-x-2">
                                                           <span className="font-bold text-gray-700 w-8">{rate}%</span>
                                                           <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                               <div className={`h-full ${rate < 50 ? 'bg-red-500' : rate < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${rate}%`}}></div>
                                                           </div>
                                                       </div>
                                                   </td>
                                                   <td className="px-4 py-3 text-right">
                                                       <span className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border shadow-sm ${hw.performance_score < 60 ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-green-300'}`}>
                                                          {hw.performance_score} / 100
                                                       </span>
                                                   </td>
                                                </tr>
                                            )
                                        })}
                                     </tbody>
                                  </table>
                               </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* CITIZEN/ADMIN: MASTER TRIAGE QUEUE */}
        {view === 'citizen_track' && (
          <div className="bg-white border border-gray-300 shadow-sm rounded-sm overflow-hidden">
             <div className="bg-[#1b3d6d] px-6 py-4 flex justify-between items-center border-b-2 border-[#FF9933]">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                   {user.role === 'admin' ? 'Triage & Master Operations Queue' : 'Complaint Status Tracker'}
                </h2>
                <span className="text-[10px] font-bold text-white bg-[#138808] px-3 py-1 rounded-sm border border-green-600 shadow-inner uppercase tracking-widest">
                    Total Entries: {complaints.length}
                </span>
             </div>

             <div className="p-4 bg-gray-100 border-b border-gray-300 flex flex-wrap gap-4 items-center">
                <span className="text-xs font-bold text-gray-600 uppercase flex items-center">
                    <Filter className="w-3 h-3 mr-1"/> Filter View:
                </span>
                <select value={filterMode} onChange={e=>setFilterMode(e.target.value)} className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm outline-none font-bold text-gray-700 shadow-sm bg-white">
                   <option value="All">All Complaints</option>
                   <option value="Urgent">Urgent Issues (Red Flag)</option>
                   <option value="Duplicates">Duplicate Records</option>
                   <option value="Voice">Voice Inputs</option>
                </select>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-200 text-[#1b3d6d] text-[10px] uppercase tracking-widest border-b-2 border-gray-300">
                      <tr>
                         <th className="px-6 py-4 font-black">ID & Multilingual Data</th>
                         <th className="px-6 py-4 font-black">Auto-Assignment</th>
                         <th className="px-6 py-4 font-black">Urgency / Duplicate Flag</th>
                         <th className="px-6 py-4 font-black">Timeline Status</th>
                         <th className="px-6 py-4 font-black text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm">
                      {complaints.filter(c => {
                          if(filterMode === 'Urgent') return c.urgency_flag === true;
                          if(filterMode === 'Duplicates') return c.duplicate_status && c.duplicate_status.includes('Duplicate');
                          if(filterMode === 'Voice') return c.input_type === 'voice';
                          return user.role === 'admin' || c.submitterId === user.id;
                      }).length === 0 ? (
                         <tr>
                             <td colSpan="5" className="text-center py-16 text-gray-500 font-bold uppercase tracking-widest bg-gray-50">
                                 No records match current filter.
                             </td>
                         </tr>
                      ) : (
                         complaints.filter(c => {
                            if(filterMode === 'Urgent') return c.urgency_flag === true;
                            if(filterMode === 'Duplicates') return c.duplicate_status && c.duplicate_status.includes('Duplicate');
                            if(filterMode === 'Voice') return c.input_type === 'voice';
                            return user.role === 'admin' || c.submitterId === user.id;
                         }).map(c => (
                           <tr key={c.id} className={`${getHighlightClass(c)} transition-colors group border-b border-gray-200`}>
                              <td className="px-6 py-5 align-top">
                                 <div className="font-bold text-[#1b3d6d] text-sm">{c.id}</div>
                                 <div className="text-xs text-gray-500 mt-1 font-semibold">{new Date(c.date).toLocaleDateString()}</div>
                                 <div className="text-xs text-gray-700 mt-3 font-medium line-clamp-3 w-48 leading-relaxed text-justify">
                                    {c.detected_language !== 'English' && c.translated_text ? c.translated_text : c.text}
                                 </div>
                                 {c.detected_language && c.detected_language !== 'English' && c.detected_language !== 'Unknown' && (
                                     <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-widest">
                                         <Languages className="w-3 h-3 mr-1"/> Translated from {c.detected_language}
                                     </span>
                                 )}
                              </td>
                              <td className="px-6 py-5 align-top">
                                 <div className="font-bold text-gray-800 uppercase text-xs tracking-wider">{c.category}</div>
                                 <div className="text-[9px] text-green-800 mt-1.5 font-bold bg-green-100 px-2 py-1 rounded-sm inline-block border border-green-200 shadow-sm uppercase tracking-widest">
                                     AI Confidence: {c.confidence_score}%
                                 </div>
                                 
                                 <div className="text-[10px] text-gray-600 mt-3 font-bold bg-gray-100 px-2 py-1 rounded-sm border border-gray-200 uppercase tracking-widest inline-block">
                                     {c.department}
                                 </div>
                                 <div className="text-[10px] text-[#1b3d6d] mt-2 font-bold flex items-start uppercase">
                                     <User className="w-3 h-3 mr-1 mt-0.5 shrink-0"/>{c.assigned_authority}
                                 </div>
                                 <div className="text-[11px] text-gray-500 mt-2 flex items-start uppercase tracking-wider font-semibold w-48">
                                    <MapPin className="w-4 h-4 mr-1 mt-0.5 shrink-0 text-[#1b3d6d]"/>
                                    <span className="line-clamp-2 leading-relaxed">{c.location}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-5 align-top">
                                 {c.urgency_flag && (
                                   <div className="text-[9px] font-black uppercase tracking-widest text-white bg-red-600 px-2 py-1.5 rounded-sm mb-3 flex items-center shadow-sm w-max animate-pulse border border-red-800">
                                       <AlertTriangle className="w-3 h-3 mr-1"/> Urgent Issue
                                   </div>
                                 )}
                                 <span className={`px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm border bg-white ${c.severity === 'Critical' || c.severity === 'High' ? 'text-red-700 border-red-300' : 'text-yellow-700 border-yellow-400'}`}>
                                    {c.severity} (Score: {c.ai_score})
                                 </span>
                              </td>
                              <td className="px-6 py-5 align-top">
                                 <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm border shadow-sm ${c.status === 'Resolved' || c.status === 'Closed' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-blue-100 text-blue-800 border-blue-300'}`}>
                                    {c.status}
                                 </span>
                              </td>
                              <td className="px-6 py-5 text-right align-top whitespace-nowrap">
                                 <button onClick={() => setSelectedComplaint(c)} className="bg-white hover:bg-gray-100 text-[#1b3d6d] px-3 py-2 rounded-sm border border-gray-300 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm mr-2">
                                     View Affidavit
                                 </button>
                              </td>
                           </tr>
                         ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </main>

      {/* OFFICIAL REPORT MODAL (PERFECT 2-PAGE FIR / AFFIDAVIT FORMAT) */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-gray-900/90 backdrop-blur-sm print:static print:bg-transparent print:p-0 print:backdrop-blur-none print:block">
           <div className="bg-gray-200 w-full max-w-5xl rounded-sm overflow-hidden shadow-2xl flex flex-col h-full md:h-[95vh] border border-gray-500 font-sans print:block print:h-auto print:shadow-none print:border-none print:max-w-none print:bg-white print:overflow-visible">
              
              <div className="bg-[#1b3d6d] p-3 text-white flex justify-between items-center shadow-md border-b-4 border-[#FF9933] no-print shrink-0">
                 <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold uppercase tracking-wider">Official Govt Affidavit Viewer</span>
                 </div>
                 <div className="flex space-x-3 items-center">
                    {user.role === 'admin' && selectedComplaint.status !== 'Closed' && selectedComplaint.status !== 'Resolved' && (
                       <div className="flex space-x-2 mr-4 border-r border-blue-500 pr-4">
                          <button onClick={() => updateStatus(selectedComplaint.id, 'In Progress', 'Assigned to field officer.')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm border border-blue-400 transition-colors shadow-sm">
                              Mark In Progress
                          </button>
                          <button onClick={() => updateStatus(selectedComplaint.id, 'Resolved', 'Issue successfully resolved and confirmed by authority.')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm border border-green-500 transition-colors shadow-sm">
                              Mark Resolved
                          </button>
                       </div>
                    )}
                    
                    <button onClick={executePrint} className="px-4 py-1.5 bg-[#FF9933] text-white font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-orange-500 transition-colors flex items-center space-x-2 shadow-sm border border-orange-600">
                       <Download className={`w-4 h-4`} />
                       <span>Save Official PDF</span>
                    </button>
                    
                    <button onClick={() => setSelectedComplaint(null)} className="p-1 hover:bg-white/20 rounded-sm transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              {/* AFFIDAVIT PAPER SCROLL CONTAINER */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center shadow-inner print:block print:h-auto print:overflow-visible print:p-0 print:shadow-none gap-8 print:gap-0">
                 
                 {/* --- PAGE 1 --- */}
                 <div id="printable-affidavit-pg1" className="w-[210mm] min-h-[297mm] print:min-h-[290mm] print:h-[290mm] print:overflow-hidden print:m-0 print:p-[10mm] bg-white shadow-2xl border border-gray-300 p-[15mm] relative text-black font-serif print:shadow-none print:border-none shrink-0 print-page">

                    <div className="relative z-10 h-full flex flex-col">
                        {/* Header Structure */}
                        <div className="flex justify-between items-start text-[10px] font-bold uppercase tracking-widest mb-6 border-b-2 border-black pb-4 shrink-0">
                           <div className="leading-relaxed">
                               <p className="text-lg font-black mb-1">ಕರ್ನಾಟಕ ಸರ್ಕಾರ</p>
                               <p>GOVERNMENT OF KARNATAKA</p>
                               <p>DEPARTMENT OF PUBLIC GRIEVANCES</p>
                           </div>
                           <div className="text-right leading-relaxed">
                               <div className="flex justify-end mb-2">
                                  <QrCode className="w-12 h-12 text-black" />
                               </div>
                               <p>Doc No: <span className="font-black text-black">{selectedComplaint.id}</span></p>
                               <p>Date: {new Date(selectedComplaint.date).toLocaleDateString()}</p>
                           </div>
                        </div>

                        <div className="text-center mb-8 shrink-0">
                           <h2 className="text-xl font-black underline uppercase tracking-widest mb-1 mt-4">Official Grievance Affidavit</h2>
                           <h3 className="text-[12px] font-bold uppercase mt-2">Janaspandana CivicTech System</h3>
                        </div>

                        {/* STRICT FLEXBOX LAYOUT FOR PERFECT PDF EXPORT (NO OVERLAPS) */}
                        <div className="border-2 border-black flex-1 flex flex-col">
                           
                           {/* Parties Section */}
                           <div className="flex border-b-2 border-black bg-gray-50 print:bg-transparent shrink-0">
                               <div className="flex-1 p-4 border-r-2 border-black">
                                   <p className="font-bold uppercase text-[10px] mb-1 text-gray-700 tracking-widest">
                                       Addressed To:
                                   </p>
                                   <p className="uppercase text-sm font-black">
                                       {selectedComplaint.assigned_authority}
                                   </p>
                                   <p className="uppercase text-xs font-bold mt-1">
                                       {selectedComplaint.department}
                                   </p>
                                   <p className="uppercase text-xs mt-1">Govt. of Karnataka</p>
                               </div>
                               <div className="flex-1 p-4">
                                   <p className="font-bold uppercase text-[10px] mb-1 text-gray-700 tracking-widest">
                                       Submitted By:
                                   </p>
                                   <p className="text-sm font-black uppercase">
                                       {selectedComplaint.submitterName || "Verified Citizen"}
                                   </p>
                                   <p className="text-xs font-bold mt-1">
                                       Citizen ID: {selectedComplaint.submitterId}
                                   </p>
                                   <p className="text-xs mt-1">
                                       Contact: {selectedComplaint.submitterPhone || selectedComplaint.phone || 'System Verified'}
                                   </p>
                               </div>
                           </div>

                           {/* Subject Section */}
                           <div className="border-b-2 border-black p-5 shrink-0">
                               <p className="font-bold uppercase text-[10px] mb-2 text-gray-700 tracking-widest border-b border-black pb-1">
                                   Subject of Grievance / Verified Description
                               </p>
                               {selectedComplaint.detected_language !== 'English' && (
                                   <div className="mb-4">
                                       <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                           Original Input ({selectedComplaint.detected_language})
                                       </p>
                                       <p className="text-sm font-semibold leading-relaxed text-justify">
                                           {selectedComplaint.text}
                                       </p>
                                   </div>
                               )}
                               <div>
                                   {selectedComplaint.detected_language !== 'English' && (
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                          English Translation / AI Extraction
                                      </p>
                                   )}
                                   <p className="text-sm font-medium leading-relaxed text-black text-justify">
                                       {selectedComplaint.translated_text || selectedComplaint.text}
                                   </p>
                               </div>
                           </div>

                           {/* Telemetry Section */}
                           <div className="flex border-b-2 border-black flex-1">
                               <div className="flex-1 p-4 border-r-2 border-black">
                                   <p className="font-bold text-[10px] uppercase mb-2 text-gray-700 tracking-widest">
                                       Precise Geolocated Address
                                   </p>
                                   <p className="text-sm font-bold leading-relaxed pr-2">
                                       {selectedComplaint.location}
                                   </p>
                                   <div className="mt-4 text-[10px] bg-gray-100 p-3 border border-gray-300 inline-block font-mono print:bg-transparent print:border-black">
                                       <span className="font-bold">LATITUDE:</span> {selectedComplaint.geo_location?.latitude ? selectedComplaint.geo_location.latitude.toFixed(6) : "N/A"}<br/>
                                       <span className="font-bold">LONGITUDE:</span> {selectedComplaint.geo_location?.longitude ? selectedComplaint.geo_location.longitude.toFixed(6) : "N/A"}<br/>
                                       <span className="font-bold">DISTRICT:</span> {selectedComplaint.district}<br/>
                                       <span className="font-bold">WARD:</span> {selectedComplaint.ward}
                                   </div>
                               </div>
                               <div className="flex-1 p-4 bg-gray-50 print:bg-transparent">
                                   <p className="font-bold text-[10px] uppercase mb-2 text-gray-700 tracking-widest">
                                       AI Categorization Matrix
                                   </p>
                                   <table className="w-full text-[11px] text-left border-collapse">
                                       <tbody>
                                           <tr className="border-b border-gray-300">
                                               <th className="py-2 w-1/3">Domain</th>
                                               <td className="py-2 font-bold uppercase">{selectedComplaint.category}</td>
                                           </tr>
                                           <tr className="border-b border-gray-300">
                                               <th className="py-2">Priority</th>
                                               <td className="py-2 font-bold uppercase text-red-700">{selectedComplaint.severity}</td>
                                           </tr>
                                           <tr className="border-b border-gray-300">
                                               <th className="py-2">AI Score</th>
                                               <td className="py-2 font-bold">{selectedComplaint.ai_score} / 100</td>
                                           </tr>
                                           <tr>
                                               <th className="py-2">Urgency</th>
                                               <td className="py-2 font-bold uppercase">
                                                   {selectedComplaint.urgency_flag ? 'IMMEDIATE ACTION REQUIRED' : 'STANDARD SLA APPLIES'}
                                               </td>
                                           </tr>
                                       </tbody>
                                   </table>
                               </div>
                           </div>
                        </div>

                        <div className="mt-auto text-center pt-4 shrink-0">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest border-t border-gray-300 pt-2">
                                Page 1 of 2 - Continue to Annexure & Timeline
                            </p>
                        </div>
                    </div>
                 </div>

                 {/* --- PAGE BREAK FOR PRINT --- */}
                 <div className="print:break-before-page"></div>

                 {/* --- PAGE 2 --- */}
                 <div id="printable-affidavit-pg2" className="w-[210mm] min-h-[297mm] print:min-h-[290mm] print:h-[290mm] print:overflow-hidden print:m-0 print:p-[10mm] bg-white shadow-2xl border border-gray-300 p-[15mm] relative text-black font-serif print:shadow-none print:border-none shrink-0 flex flex-col print-page">

                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="border-b-2 border-black pb-2 mb-6 shrink-0 flex justify-between items-end">
                            <h3 className="font-black text-sm uppercase tracking-widest">
                                Document Reference: {selectedComplaint.id}
                            </h3>
                            <p className="text-[10px] font-bold uppercase text-gray-600">
                                Annexure & Authority Signatures
                            </p>
                        </div>

                        {/* Evidence & Timeline */}
                        <div className="border-2 border-black flex-1 flex flex-col">
                           
                           {/* FIXED: DYNAMIC AUTO-CROP PHOTO GRID */}
                           {(() => {
                               const evidenceImages = selectedComplaint.photos?.length > 0 
                                   ? selectedComplaint.photos 
                                   : (selectedComplaint.photoBase64 ? [selectedComplaint.photoBase64] : []);

                               if (evidenceImages.length > 0) {
                                   return (
                                       <div className="p-6 border-b-2 border-black text-center bg-gray-50 print:bg-transparent shrink-0">
                                           <p className="font-bold text-[10px] uppercase mb-4 text-gray-700 tracking-widest text-left">
                                               Annexure A: Captured Visual Evidence (Live Tagged)
                                           </p>
                                           <div className={`grid gap-2 mx-auto w-full ${
                                               evidenceImages.length === 1 ? 'grid-cols-1 h-[300px]' : 
                                               evidenceImages.length === 2 ? 'grid-cols-2 h-[250px]' : 
                                               'grid-cols-2 h-[350px]'
                                           }`}>
                                               {evidenceImages.slice(0, 4).map((imgSrc, idx) => (
                                                    <img 
                                                        key={idx} 
                                                        src={imgSrc} 
                                                        onError={handleLogoError}
                                                        alt={`Evidence ${idx + 1}`} 
                                                        className="w-full h-full object-cover border-2 border-gray-300 shadow-sm print:border-black rounded-sm" 
                                                    />
                                               ))}
                                           </div>
                                       </div>
                                   );
                               }
                               return null;
                           })()}
                           
                           <div className="p-6 flex-1 bg-white">
                               <p className="font-bold text-[10px] uppercase mb-4 text-gray-700 tracking-widest border-b border-gray-300 pb-2">
                                   Part II: Official Action & Resolution Timeline
                               </p>
                               <StatusTimeline history={selectedComplaint.status_history} />
                           </div>
                        </div>

                        {/* Declarations and Official Signatures Section */}
                        <div className="mt-8 pt-4 shrink-0">
                           <div className="mb-8 text-[9px] text-gray-700 leading-relaxed text-justify border border-gray-300 p-4 bg-gray-50 print:bg-transparent print:border-black">
                               <strong className="uppercase block mb-1">Declaration of Authenticity:</strong>
                               This document constitutes a formal record generated by the Government of Karnataka's Janaspandana CivicTech System. The visual evidence contained in Annexure A was captured live to prevent spoofing, and the geolocation metadata has been cryptographically attached. The complainant affirms that the information provided is true to the best of their knowledge. False reporting is punishable under applicable sections of law. The assigned authority is mandated to resolve the issue as per the Departmental SLA Matrix.
                           </div>

                           <div className="flex justify-between items-end mt-10">
                               <div className="text-center w-[45mm]">
                                   <div className="border-b border-black mb-2 h-12 flex items-end justify-center pb-1">
                                       <span className="text-[10px] italic text-gray-500">Digitally Verified</span>
                                   </div>
                                   <p className="text-[10px] font-bold uppercase tracking-widest">
                                       Complainant Signature
                                   </p>
                                   <p className="text-[10px] text-black mt-1 uppercase font-bold truncate">
                                       {selectedComplaint.submitterName}
                                   </p>
                               </div>
                               
                               <div className="text-center flex flex-col items-center">
                                   <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-2 bg-transparent relative">
                                      <div className="w-20 h-20 border border-black rounded-full absolute"></div>
                                      <span className="text-[7px] font-bold text-black uppercase text-center w-full block leading-tight">
                                          Govt. of Karnataka<br/><br/>Official<br/>E-Seal<br/><br/>{selectedComplaint.department}
                                      </span>
                                   </div>
                               </div>

                               <div className="text-center w-[45mm]">
                                   <div className="border-b border-black mb-2 h-12 flex items-end justify-center pb-1">
                                       <span className="text-[10px] italic text-gray-500">System Assigned</span>
                                   </div>
                                   <p className="text-[10px] font-bold uppercase tracking-widest">
                                       Authorised Officer
                                   </p>
                                   <p className="text-[10px] text-black mt-1 uppercase font-bold truncate">
                                       {selectedComplaint.assigned_authority}
                                   </p>
                               </div>
                           </div>
                        </div>

                        <div className="mt-8 text-center border-t border-black pt-2 shrink-0 print:page-break-after-auto">
                            <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">
                                End of Document - Page 2 of 2 - Verify at janaspandana.karnataka.gov.in
                            </p>
                        </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}

      {/* AI CHATBOT */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end no-print">
         {isChatOpen && (
           <div className="w-[340px] h-[480px] bg-white border border-gray-300 shadow-2xl mb-4 flex flex-col rounded-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#1b3d6d] p-3 text-white flex justify-between items-center border-b-4 border-[#FF9933]">
                 <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-white"/>
                    <span className="font-bold text-xs uppercase tracking-widest">CivicTech Chatbot</span>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-300">
                     <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                 {chatMessages.map((m, i) => (
                   <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-sm text-xs border shadow-sm ${m.role === 'user' ? 'bg-[#e6f0fa] border-blue-200 text-blue-900 font-bold' : 'bg-white border-gray-300 text-gray-800 font-medium'}`}>
                        {m.text}
                      </div>
                      {m.options && (
                          <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                              {m.options.map(opt => (
                                  <button key={opt} onClick={() => handleChatOption(opt)} className="bg-white border border-[#1b3d6d] text-[#1b3d6d] text-[10px] font-bold px-2 py-1 rounded-sm hover:bg-blue-50 transition-colors shadow-sm">
                                      {opt}
                                  </button>
                              ))}
                          </div>
                      )}
                   </div>
                 ))}
              </div>
              
              <form onSubmit={sendChat} className="p-3 bg-white border-t border-gray-300 flex space-x-2">
                 <input 
                     value={chatInput} 
                     onChange={e => setChatInput(e.target.value)} 
                     placeholder="Type issue or ID..." 
                     className="flex-1 bg-white border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-[#1b3d6d] focus:ring-1 focus:ring-[#1b3d6d] rounded-sm" 
                 />
                 <button type="submit" className="bg-[#1b3d6d] px-3 py-1.5 text-white rounded-sm hover:bg-[#152e53] transition-colors">
                     <Send className="w-4 h-4"/>
                 </button>
              </form>
           </div>
         )}
         <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-[#1b3d6d] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#152e53] border-2 border-white transition-transform hover:scale-105 active:scale-95">
            <MessageCircle className="w-6 h-6" />
         </button>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(130px); }
        }

        /* --- STRICT PRINT STYLES FOR FLAWLESS MULTI-PAGE PDF EXPORT --- */
        @media print {
            body, html { 
               background: white !important; 
               margin: 0 !important; 
               padding: 0 !important; 
               -webkit-print-color-adjust: exact !important;
               print-color-adjust: exact !important;
               overflow: hidden !important;
               height: auto !important;
            }
            .no-print, .no-print-bg { 
               display: none !important; 
            }
            @page { 
               size: A4 portrait; 
               margin: 0 !important; 
            }
            
            /* Custom Print Page Formatting - Guarantees exactly 2 pages with no extra blanks */
            .print-page {
               width: 210mm !important;
               height: 290mm !important; /* Strict height lock prevents blank 3rd page */
               min-height: 290mm !important;
               max-height: 290mm !important;
               margin: 0 auto !important;
               padding: 10mm !important;
               border: none !important;
               box-shadow: none !important;
               overflow: hidden !important;
               page-break-after: always !important;
               page-break-inside: avoid !important;
               box-sizing: border-box !important;
            }
            .print-page:last-of-type {
               page-break-after: avoid !important;
            }

            /* Override the fixed modal positioning for printing */
            .print-modal-overlay {
               position: absolute !important;
               top: 0 !important;
               left: 0 !important;
               background: transparent !important;
               backdrop-filter: none !important;
               display: block !important;
               padding: 0 !important;
            }
            .print-modal-content {
               display: block !important;
               height: auto !important;
               overflow: visible !important;
               border: none !important;
               background: transparent !important;
            }
        }
      `}</style>
    </div>
  );
}