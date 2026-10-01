# CampusPulse — Early Wellbeing Signal System

> **"See the change. Offer support earlier."**  
> *Track 02: Early Warning System — Spot students who may need help before crisis.*

---

## 1. Product Overview

**CampusPulse** is a privacy-aware early wellbeing signal platform that helps university students identify subtle shifts in self-reported wellbeing and connects them to human support earlier. It enables authorized support staff to triage incoming signals explainably and provides university leadership with aggregated, anonymized intelligence to address institutional bottlenecks.

### Important Product & Safety Principle
CampusPulse is **NOT** a diagnostic tool and does **NOT** predict or diagnose mental illness:
- We never state: *"AI detects depression"* or *"AI predicts mental illness"*.
- We use supportive, operational language: *"wellbeing signals"*, *"support needs"*, *"change in wellbeing"*, and *"sustained deterioration in self-reported wellbeing"*.
- The AI assists human support teams—it never replaces human judgment.
- Students can always request support at any time, even if signals appear stable.

---

## 2. Challenge Statement & Innovation

> *"A mid-sized university has a student wellbeing crisis it cannot fully see. Mental health referrals are up 40%, support is fragmented across 12 departments, and students can wait three weeks for a first appointment."*

**The CampusPulse Solution:**
1. **Low-friction 30-second weekly check-in:** Quick 5-dimension pulse (Stress, Sleep, Academic Workload, Social Connection, Overwhelm) plus optional free text.
2. **Transparent Multi-Signal ML:** Normalizes indicator directions, calculates multi-week trajectory slope using scikit-learn Linear Regression, and classifies student notes into support topics (e.g., academic, financial) using NLP.
3. **Explainable AI (XAI):** Clear bullet points explaining *"Why we're suggesting support"* so students and staff understand the reasoning.
4. **Consensual Human Support Routing:** Students control when to request outreach; requests are dispatched directly into the staff triage queue.
5. **Strict Privacy Architecture:** Student-level details are visible only to authorized triage staff; the university administration sees only aggregated cohort data.

---

## 3. Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   CampusPulse Frontend                 │
│         React 18 • Vite • Tailwind CSS • Recharts      │
│  Student Portal  │  Staff Operations  │  Admin Intel   │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│            Python 3.10+ • Pydantic • SQLAlchemy        │
├───────────────────────────┬────────────────────────────┤
│       AI / ML Engine      │       Data & Services      │
│  - Trend Regression (OLS) │  - SQLite / SQLAlchemy     │
│  - NLP Support Classifier │  - Multi-Signal Synthesis  │
│  - Explainable AI Engine  │  - Seed Data Generator     │
└────────────────────────────────────────────────────────┘
```

- **Frontend:** React, Vite, Tailwind CSS, React Router, Recharts, Lucide React
- **Backend:** FastAPI, Python, SQLAlchemy, SQLite, Pydantic
- **Machine Learning:** scikit-learn (`LinearRegression`, `TfidfVectorizer`, `LogisticRegression`), pandas, numpy
- **Port Allocation:** Frontend on `http://localhost:5173`, Backend on `http://localhost:8000`

---

## 4. AI / ML Components

### Component 1: Multi-Signal Trend & Trajectory Detection (`app/ml/trend_analyzer.py`)
- Directional normalization into a composite wellbeing strain score ($0.0$ to $1.0$):
  - $\text{stress\_strain} = \text{stress} / 5$
  - $\text{sleep\_strain} = (5 - \text{sleep}) / 4$ *(lower sleep = worse strain)*
  - $\text{workload\_strain} = \text{workload} / 5$
  - $\text{social\_strain} = (5 - \text{social\_connection}) / 4$ *(lower connection = worse strain)*
  - $\text{overwhelm\_strain} = \text{overwhelm} / 5$
- Uses scikit-learn `LinearRegression` over chronological check-ins to compute trajectory slope (worsening, stable, improving) and count consecutive deteriorating check-ins.
- Categorizes support routing into non-clinical buckets: `Stable`, `Emerging concern`, `Support recommended`, or `Urgent support pathway`.

### Component 2: NLP Free-Text Support Topic Classifier (`app/ml/text_classifier.py`)
- Uses `TfidfVectorizer(ngram_range=(1,2))` and `LogisticRegression` trained locally on campus support categories:
  - `academic` (assignments, coursework, exams)
  - `wellbeing` (stress, anxiety, exhaustion)
  - `financial` (tuition, bursaries, expenses)
  - `social` (isolation, roommate conflicts, loneliness)
  - `accommodation` (housing, dorm maintenance)
  - `general`
- Fast, 100% offline, privacy-preserving, and requires no external API keys.

### Component 3: Personalized Support Pathway Recommendation (`app/services/recommendation_service.py`)
- Maps multi-signal strain, detected text topics, and explicit student preferences to campus support services (Academic Tutoring, Confidential Wellbeing Advisors, Financial Aid Desk, Peer Mentorship, Housing Advisory).

---

## 5. Project Structure

```
coinovation_day/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py              # FastAPI application & lifespan startup
│       ├── database.py          # SQLite engine & session
│       ├── models.py            # SQLAlchemy tables (Student, CheckIn, etc.)
│       ├── schemas.py           # Pydantic request/response models
│       ├── seed.py              # Realistic demo seed generator (CP1042 scenario)
│       ├── ml/
│       │   ├── __init__.py
│       │   ├── trend_analyzer.py # scikit-learn OLS slope & strain scoring
│       │   └── text_classifier.py# TF-IDF + LogisticRegression NLP classifier
│       ├── services/
│       │   ├── __init__.py
│       │   ├── analysis_service.py
│       │   ├── recommendation_service.py
│       │   └── companion_service.py
│       └── api/
│           ├── __init__.py
│           ├── routes_students.py
│           ├── routes_checkins.py
│           ├── routes_support.py
│           ├── routes_dashboards.py
│           ├── routes_resources.py
│           ├── routes_ml.py
│           └── routes_chat.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── RoleContext.jsx   # Role switcher & current student context
│       ├── services/
│       │   └── api.js           # API client for backend communication
│       ├── components/
│       │   ├── AppShell.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Topbar.jsx
│       │   ├── StatCard.jsx
│       │   ├── TrendCard.jsx
│       │   ├── SignalBadge.jsx
│       │   ├── CheckInSlider.jsx
│       │   ├── CheckInQuestion.jsx
│       │   ├── SupportResourceCard.jsx
│       │   ├── AIInsightCard.jsx
│       │   ├── Timeline.jsx
│       │   ├── WellbeingChart.jsx
│       │   ├── SupportRequestTable.jsx
│       │   ├── CaseDetail.jsx
│       │   ├── PrivacyNotice.jsx
│       │   ├── EmergencyHelpCard.jsx
│       │   ├── LoadingAnalysis.jsx
│       │   ├── ChatAssistant.jsx
│       │   └── RoleSwitcherModal.jsx
│       └── pages/
│           ├── LandingPage.jsx
│           ├── StudentHome.jsx
│           ├── StudentCheckIn.jsx
│           ├── StudentResult.jsx
│           ├── StudentHistory.jsx
│           ├── StaffDashboard.jsx
│           └── AdminDashboard.jsx
└── README.md
```

---

## 6. Setup & Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

---

### Step 1: Start the Backend (`localhost:8000`)

#### Windows (PowerShell or Command Prompt):
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### macOS / Linux:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

*Note: On first startup, the SQLite database (`campuspulse.db`) and realistic seed data (including demo student CP1042) will be created automatically.*

---

### Step 2: Start the Frontend (`localhost:5173`)

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 7. Key REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/students` | List all demo students |
| `GET` | `/api/students/{id}` | Student record by ID |
| `GET` | `/api/students/{id}/checkins` | Check-in history |
| `POST` | `/api/checkins` | Submit new weekly check-in |
| `GET` | `/api/students/{id}/analysis` | Explainable signal trend analysis |
| `GET` | `/api/students/{id}/recommendations` | Personalized support pathways |
| `POST` | `/api/support-requests` | Create student support request |
| `GET` | `/api/support-requests` | Staff triage queue |
| `GET` | `/api/support-requests/{id}` | Detailed case review with signals |
| `PATCH`| `/api/support-requests/{id}` | Update triage status (New, Assigned, Contacted, Resolved) |
| `GET` | `/api/dashboard/staff` | Operational triage KPIs and daily volume |
| `GET` | `/api/dashboard/admin` | Aggregated anonymized institutional intelligence |
| `POST` | `/api/ml/classify-text` | NLP support topic classification |
| `GET` | `/api/resources` | Campus support services directory |
| `POST` | `/api/chat/companion` | Campus Companion navigation assistant |

---

## 8. Hackathon Demo Walkthrough (CP1042 Scenario)

Follow this 12-step flow for judges:

1. **Open Landing Page (`/`):** View the mission: *"See the change. Offer support earlier."* Click **[Explore as Student]**.
2. **Student Home (`/student`):** See personalized greeting *"Good morning, Alex"*, last check-in snapshot, and support directory. Click **[Start Check-in]**.
3. **Weekly Check-in (`/student/check-in`):** Click the amber button **[Pre-fill CP1042 Demo Scenario]** to automatically populate Week 4 data (Stress 5, Sleep 1, Workload 5, Social 2, Overwhelm 5, Coursework struggle: Yes, Support preference: "Academic Support", and student note: *"I have three assignments due this week and two exams coming up..."*).
4. **Submit Check-in:** Click **[Submit Check-in]**.
5. **Processing State:** Watch the 1.5-second animated radar pulse: *"Analyzing recent wellbeing signals..."*.
6. **Student Result (`/student/result`):**
   - Signal Badge: `[ Emerging Support Signal ]`
   - Trend Cards: `Stress ↑`, `Academic Workload ↑`, `Sleep Quality ↓`
   - Explainable AI: *"Why we're suggesting support"* (Workload increased for 3 weeks, Stress elevated, Sleep declined).
   - Reassurance: *"You are not being diagnosed. We're simply helping you find support earlier."*
7. **Personalized Support Pathways:** System recommends **Academic Support & Tutoring**, **Confidential Wellbeing Advisor**, and **Study Planning Resources**.
8. **Request Support:** Click **[Request Academic Support]**.
9. **Confirmation Screen:** Confirmation shows request has been dispatched to staff triage. Click **[View in Staff Queue]**.
10. **Support Staff Operations (`/staff`):**
    - View triage statistics (1,284 students checked in, 96 active requests, 1.7d avg response time).
    - See the newly created case for `Student CP1042` at the top of the queue.
11. **Staff Case Detail:** Click on CP1042 to inspect:
    - Multi-signal breakdown (Stress 5/5, Workload 5/5, Sleep 1/5).
    - NLP Text Classification: `Academic Workload (91% confidence)`.
    - Early Signal Timeline: Change detected over time across 4 weeks.
    - Action Buttons: Assign to Advisor, Contact Student, Resolve Case.
12. **University Admin Intelligence (`/admin`):** Switch to University Admin.
    - Notice that student-level identities are completely removed.
    - Review aggregated monthly trends, topic distribution (42% academic workload), and department strain indicators.
    - View the **Operational Action Insight**: *"Academic workload-related support requests increased 23% over the last 4 weeks. Consider increasing academic advising availability during the examination period."*

---

## 9. Privacy & Safety Commitments

- **No Medical Labels:** The system never labels a student as "depressed" or "mentally ill".
- **Strict Role Separation:**
  - *Students* see their own reflections, trends, and support pathways.
  - *Staff* see actionable case signals only with student consent or severe multi-checkin escalation.
  - *University Admins* see only aggregated cohort distributions without individual identifiers.
- **Local Execution:** All scikit-learn models and NLP classifiers run locally on your machine—no sensitive check-in notes or student data are transmitted to third-party APIs.

---

## 10. Future Roadmap

- Integration with university Learning Management Systems (LMS) for course-specific extension workflows.
- Opt-in peer support circles and study-group matchmaking based on academic schedule alignment.
- Multi-lingual student check-in localized for international student populations.
- Expanded calendar integration for scheduling triage meetings directly with academic advisors.

---

*Developed for the University Innovation Hackathon 2026 • CampusPulse Team*
