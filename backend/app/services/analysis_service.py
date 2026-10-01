from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models import CheckIn, Student
from ..ml.trend_analyzer import analyze_checkin_trends, compute_checkin_strain
from ..ml.text_classifier import classify_student_text
from .recommendation_service import get_recommended_support_services

def get_student_analysis(db: Session, student_id: int) -> Dict[str, Any]:
    """
    Computes explainable wellbeing signal analysis for a given student across historical check-ins.
    """
    # Fetch checkins ordered by date ascending for chronological analysis
    checkins_asc = db.query(CheckIn).filter(CheckIn.student_id == student_id).order_by(CheckIn.created_at.asc()).all()

    if not checkins_asc:
        return {
            "status": "stable",
            "trend": "stable",
            "strain_score": 0.20,
            "signals": [],
            "text_topics": [],
            "reasons": ["No check-in history logged yet. Complete your first check-in to see personalized signals."],
            "recommended_support": ["Confidential Wellbeing Advisor", "Academic Support", "Campus Resources"],
            "consecutive_deteriorating": 0,
            "history_summary": {"total_checkins": 0}
        }

    # Trend and multi-signal analysis
    trend_result = analyze_checkin_trends(checkins_asc)

    # Free text topic analysis on the latest check-in
    latest_checkin = checkins_asc[-1]
    text_topics = []
    if latest_checkin.free_text:
        text_topics = classify_student_text(latest_checkin.free_text)

    # Personalized support recommendations
    recommended_support = get_recommended_support_services(
        trend_result=trend_result,
        text_topics=text_topics,
        support_preference=latest_checkin.support_type
    )

    # Compile structured history data for frontend visualizations
    history_points = []
    for c in checkins_asc:
        strain_info = compute_checkin_strain(c)
        history_points.append({
            "id": c.id,
            "date": c.created_at.strftime("%b %d"),
            "strain": strain_info["composite"],
            "stress": c.stress_score,
            "sleep": c.sleep_score,
            "workload": c.workload_score,
            "social": c.social_connection_score,
            "overwhelmed": c.overwhelmed_score,
            "attendance_problem": c.attendance_problem,
            "support_requested": c.support_requested,
            "support_type": c.support_type
        })

    return {
        "status": trend_result["status"],
        "trend": trend_result["trend"],
        "strain_score": trend_result["strain_score"],
        "signals": trend_result["signals"],
        "text_topics": text_topics,
        "reasons": trend_result["reasons"],
        "recommended_support": recommended_support,
        "consecutive_deteriorating": trend_result["consecutive_deteriorating"],
        "history_summary": {
            "total_checkins": len(checkins_asc),
            "points": history_points
        }
    }
