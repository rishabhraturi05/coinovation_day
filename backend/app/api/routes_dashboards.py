from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, CheckIn, SupportRequest
from ..services.analysis_service import get_student_analysis

router = APIRouter(prefix="/api/dashboard", tags=["Dashboards"])

@router.get("/staff")
def get_staff_dashboard(db: Session = Depends(get_db)):
    """
    Returns operational triage analytics and case queue for authorized support staff.
    """
    total_students = db.query(Student).count()
    total_checkins = db.query(CheckIn).count()
    all_requests = db.query(SupportRequest).order_by(SupportRequest.created_at.desc()).all()

    new_requests = [r for r in all_requests if r.status == "New"]
    pending_followups = [r for r in all_requests if r.status in ["New", "Assigned"]]

    # Build 30-day support trend series
    today = datetime.utcnow().date()
    daily_trend = []
    # Seeded realistic daily numbers for the last 14 days
    demo_day_counts = [2, 3, 1, 4, 3, 5, 2, 4, 6, 5, 7, 6, 8, len(new_requests)]
    for idx, count in enumerate(demo_day_counts):
        day_date = today - timedelta(days=len(demo_day_counts) - 1 - idx)
        daily_trend.append({
            "date": day_date.strftime("%b %d"),
            "requests": count,
            "resolved": max(0, count - 1)
        })

    # Recent case queue with explainable badges
    case_queue = []
    for r in all_requests[:15]:
        st = db.query(Student).filter(Student.id == r.student_id).first()
        student_code = st.student_code if st else f"CP{1000 + r.student_id}"

        # Quick signal estimation
        if r.priority == "Urgent":
            signal_label = "Urgent Support Pathway"
            trend_label = "Rapid Decline"
        elif r.priority == "Elevated":
            signal_label = "Emerging Support Signal"
            trend_label = "Worsening"
        else:
            signal_label = "Support Requested"
            trend_label = "Stable"

        time_diff = datetime.utcnow() - r.created_at
        if time_diff.total_seconds() < 3600:
            time_str = f"{max(1, int(time_diff.total_seconds() / 60))} min ago"
        elif time_diff.total_seconds() < 86400:
            time_str = f"{int(time_diff.total_seconds() / 3600)} hr ago"
        else:
            time_str = f"{int(time_diff.days)} days ago"

        case_queue.append({
            "id": r.id,
            "student_id": r.student_id,
            "student_code": student_code,
            "department": st.department if st else "Engineering",
            "signal": signal_label,
            "trend": trend_label,
            "support_requested": r.support_type,
            "time": time_str,
            "status": r.status,
            "priority": r.priority,
            "assigned_to": r.assigned_to or "Unassigned"
        })

    return {
        "stats": {
            "students_checked_in": "1,284",
            "support_requests_active": len(all_requests),
            "followups_pending": len(pending_followups),
            "emerging_support_signals": 18,
            "average_response_time": "1.7 days"
        },
        "support_topics": [
            {"topic": "Academic Workload", "percentage": 42, "count": 40},
            {"topic": "Wellbeing & Stress", "percentage": 31, "count": 30},
            {"topic": "Financial Advisory", "percentage": 15, "count": 14},
            {"topic": "Social Belonging", "percentage": 8, "count": 8},
            {"topic": "Accommodation", "percentage": 4, "count": 4}
        ],
        "waiting_times": [
            {"range": "< 24 hrs", "percentage": 68},
            {"range": "1 - 3 days", "percentage": 24},
            {"range": "3 - 5 days", "percentage": 6},
            {"range": "> 5 days", "percentage": 2}
        ],
        "daily_trend": daily_trend,
        "case_queue": case_queue
    }

@router.get("/admin")
def get_admin_dashboard(db: Session = Depends(get_db)):
    """
    Returns university-wide aggregated and strictly anonymized wellbeing intelligence.
    NO individual student identifiers are returned.
    """
    # Department breakdown
    departments_summary = [
        {"department": "Computer Science & IT", "checkins": 842, "rising_signal": "Academic Workload", "change": "+24%"},
        {"department": "Mechanical Engineering", "checkins": 612, "rising_signal": "Coursework Pacing", "change": "+12%"},
        {"department": "Electrical Engineering", "checkins": 530, "rising_signal": "Exam Pressure", "change": "+19%"},
        {"department": "First Year General", "checkins": 790, "rising_signal": "Social Adjustment", "change": "+31%"},
        {"department": "Business & Analytics", "checkins": 490, "rising_signal": "Financial Advisory", "change": "+8%"},
        {"department": "Biotechnology & Science", "checkins": 360, "rising_signal": "Lab Workload", "change": "+5%"},
    ]

    # Monthly demand trends
    monthly_trends = [
        {"month": "May", "checkins": 2100, "support_requests": 62, "avg_wait_days": 2.4},
        {"month": "Jun", "checkins": 1850, "support_requests": 48, "avg_wait_days": 2.1},
        {"month": "Jul", "checkins": 1420, "support_requests": 34, "avg_wait_days": 1.9},
        {"month": "Aug", "checkins": 2890, "support_requests": 74, "avg_wait_days": 1.8},
        {"month": "Sep", "checkins": 3824, "support_requests": 96, "avg_wait_days": 1.7},
    ]

    # Cohort observations
    cohort_observations = [
        {
            "cohort": "Engineering Faculty",
            "trend": "Academic workload elevated",
            "signal_direction": "up",
            "context": "Cluster of assignments converging in weeks 6-8."
        },
        {
            "cohort": "First-Year Students",
            "trend": "Social adjustment & belonging queries",
            "signal_direction": "up",
            "context": "Initial transition from high school to autonomous university routine."
        },
        {
            "cohort": "Hostel Residents",
            "trend": "Social & sleep environment feedback",
            "signal_direction": "up",
            "context": "Noise complaints and sleep cycle disruptions reported in campus halls."
        }
    ]

    return {
        "stats": {
            "checkins_this_month": "3,824",
            "support_demand_change": "+18%",
            "average_response_time": "1.7 days",
            "departments_with_rising_demand": 4,
            "overall_participation_rate": "72%"
        },
        "monthly_trends": monthly_trends,
        "departments_summary": departments_summary,
        "cohort_observations": cohort_observations,
        "topic_distribution": [
            {"name": "Academic Workload", "value": 42},
            {"name": "Wellbeing", "value": 31},
            {"name": "Financial", "value": 15},
            {"name": "Social", "value": 8},
            {"name": "Accommodation", "value": 4}
        ],
        "operational_insight": {
            "title": "Emerging Pattern: Mid-Semester Academic Strain",
            "observation": "Academic workload-related support requests increased 23% across STEM departments over the last 4 weeks.",
            "operational_response": "Consider increasing academic advising availability and offering targeted study pacing workshops before the mid-term examination period.",
            "status": "Actionable Operational Insight",
            "is_prototype": True
        }
    }
