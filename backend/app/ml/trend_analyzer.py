import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from sklearn.linear_model import LinearRegression

def compute_checkin_strain(checkin) -> Dict[str, float]:
    """
    Normalizes direction of checkin indicators to unified strain scale (0.0 to 1.0).
    Higher strain indicates greater support need.
    Note: These are operational prototype signals, NOT medical or clinical scores.
    """
    stress_strain = float(checkin.stress_score) / 5.0
    # sleep_score is 1-5 where 5 is high quality sleep, 1 is poor sleep
    sleep_strain = max(0.0, min(1.0, (5.0 - float(checkin.sleep_score)) / 4.0))
    workload_strain = float(checkin.workload_score) / 5.0
    # social_connection is 1-5 where 5 is well connected, 1 is isolated
    social_strain = max(0.0, min(1.0, (5.0 - float(checkin.social_connection_score)) / 4.0))
    overwhelm_strain = float(checkin.overwhelmed_score) / 5.0

    # Composite strain weight
    composite = (
        0.25 * stress_strain +
        0.20 * sleep_strain +
        0.25 * workload_strain +
        0.15 * overwhelm_strain +
        0.15 * social_strain
    )

    return {
        "composite": round(composite, 3),
        "stress_strain": round(stress_strain, 3),
        "sleep_strain": round(sleep_strain, 3),
        "workload_strain": round(workload_strain, 3),
        "social_strain": round(social_strain, 3),
        "overwhelm_strain": round(overwhelm_strain, 3),
    }

def analyze_checkin_trends(checkins_asc: List[Any]) -> Dict[str, Any]:
    """
    Analyzes student check-in history chronologically (oldest to newest).
    Uses scikit-learn LinearRegression to detect trend slope and direction.
    """
    if not checkins_asc:
        return {
            "status": "stable",
            "trend": "stable",
            "strain_score": 0.2,
            "slope": 0.0,
            "consecutive_deteriorating": 0,
            "signals": [],
            "reasons": ["No previous check-in data available."]
        }

    strains = [compute_checkin_strain(c) for c in checkins_asc]
    composites = [s["composite"] for s in strains]
    current_strain = composites[-1]

    # Calculate trend using LinearRegression if we have 2+ check-ins
    slope = 0.0
    if len(composites) >= 2:
        X = np.arange(len(composites)).reshape(-1, 1)
        y = np.array(composites)
        reg = LinearRegression().fit(X, y)
        slope = float(reg.coef_[0])

    # Determine trend classification
    if slope > 0.04:
        trend = "worsening"
    elif slope < -0.04:
        trend = "improving"
    else:
        trend = "stable"

    # Consecutive deteriorating count from the end
    consecutive_deteriorating = 0
    for i in range(len(composites) - 1, 0, -1):
        if composites[i] > composites[i - 1]:
            consecutive_deteriorating += 1
        else:
            break

    # Analyze individual signal shifts between recent and previous checkins
    signals = []
    latest = checkins_asc[-1]
    prev = checkins_asc[-2] if len(checkins_asc) >= 2 else None

    # Stress signal
    if latest.stress_score >= 4 or (prev and latest.stress_score > prev.stress_score):
        dir_val = "up"
        exp = "Stress has elevated across recent check-ins." if (prev and latest.stress_score > prev.stress_score) else "High self-reported stress level."
    elif latest.stress_score <= 2 and prev and latest.stress_score < prev.stress_score:
        dir_val = "down"
        exp = "Stress levels have eased recently."
    else:
        dir_val = "stable"
        exp = "Stress reports remain relatively stable."
    signals.append({"name": "Stress", "direction": dir_val, "explanation": exp})

    # Academic Workload signal
    if latest.workload_score >= 4 or (prev and latest.workload_score > prev.workload_score):
        dir_val = "up"
        exp = "Academic workload has increased recently."
    elif latest.workload_score <= 2 and prev and latest.workload_score < prev.workload_score:
        dir_val = "down"
        exp = "Academic workload has become more manageable."
    else:
        dir_val = "stable"
        exp = "Academic workload remains steady."
    signals.append({"name": "Academic Workload", "direction": dir_val, "explanation": exp})

    # Sleep quality signal (note: for sleep, 'down' direction means worse sleep quality!)
    if latest.sleep_score <= 2 or (prev and latest.sleep_score < prev.sleep_score):
        dir_val = "down"
        exp = "Sleep quality has declined in recent check-ins."
    elif latest.sleep_score >= 4 and prev and latest.sleep_score > prev.sleep_score:
        dir_val = "up"
        exp = "Sleep quality has improved."
    else:
        dir_val = "stable"
        exp = "Sleep quality has remained consistent."
    signals.append({"name": "Sleep Quality", "direction": dir_val, "explanation": exp})

    # Social connection signal
    if latest.social_connection_score <= 2 or (prev and latest.social_connection_score < prev.social_connection_score):
        dir_val = "down"
        exp = "Student reports feeling less connected to peers."
        signals.append({"name": "Social Connection", "direction": dir_val, "explanation": exp})
    
    # Overwhelmed signal
    if latest.overwhelmed_score >= 4 or (prev and latest.overwhelmed_score > prev.overwhelmed_score):
        dir_val = "up"
        exp = "Feelings of being overwhelmed have intensified."
        signals.append({"name": "Overwhelm", "direction": dir_val, "explanation": exp})

    # Determine prototype support status category
    # Categories: 'stable', 'emerging_concern', 'support_recommended', 'urgent_support_pathway'
    has_urgent_factors = (
        (latest.stress_score == 5 and latest.overwhelmed_score == 5 and latest.sleep_score == 1) or
        (latest.attendance_problem and latest.support_requested and current_strain >= 0.75)
    )
    
    if has_urgent_factors:
        status = "urgent_support_pathway"
    elif current_strain >= 0.60 or (trend == "worsening" and current_strain >= 0.45) or latest.support_requested:
        status = "support_recommended"
    elif current_strain >= 0.40 or trend == "worsening":
        status = "emerging_concern"
    else:
        status = "stable"

    # Generate explainable reasons
    reasons = []
    if consecutive_deteriorating >= 2:
        reasons.append(f"Wellbeing strain has risen over {consecutive_deteriorating + 1} consecutive check-ins")
    elif trend == "worsening":
        reasons.append("Upward trajectory in self-reported strain over recent weeks")
        
    if latest.workload_score >= 4:
        reasons.append("Academic workload is reported as high or unmanageable")
    if latest.stress_score >= 4:
        reasons.append("Elevated stress levels reported this week")
    if latest.sleep_score <= 2:
        reasons.append("Sleep quality has declined to low levels")
    if latest.attendance_problem:
        reasons.append("Student noted difficulty keeping up with coursework/classes")
    if latest.support_requested:
        reasons.append("Student explicitly indicated they would like support")
    if latest.social_connection_score <= 2:
        reasons.append("Reported feeling isolated or low social connectedness")

    if not reasons:
        reasons.append("Responses reflect a stable and manageable routine this week")

    return {
        "status": status,
        "trend": trend,
        "strain_score": round(current_strain, 2),
        "slope": round(slope, 3),
        "consecutive_deteriorating": consecutive_deteriorating,
        "signals": signals,
        "reasons": reasons
    }
