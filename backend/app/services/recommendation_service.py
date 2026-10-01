from typing import List, Dict, Any

def get_recommended_support_services(
    trend_result: Dict[str, Any],
    text_topics: List[Dict[str, Any]],
    support_preference: str = None
) -> List[str]:
    """
    Determines personalized support recommendations based on multi-signal inputs.
    Non-prescriptive and non-diagnostic; provides clear pathway navigation.
    """
    recommendations = []
    topics = [t["category"] for t in text_topics]
    primary_topic = topics[0] if topics else "general"

    # Check explicit student choice first
    if support_preference:
        pref = support_preference.lower()
        if "academic" in pref:
            recommendations.append("Academic Support & Peer Tutoring")
        elif "talk" in pref or "advisor" in pref:
            recommendations.append("Confidential Wellbeing Advisor")
        elif "resource" in pref:
            recommendations.append("Student Study & Life Planning Resources")

    # Match based on free-text topic detection
    if "academic" in topics:
        if "Academic Support & Peer Tutoring" not in recommendations:
            recommendations.append("Academic Support & Peer Tutoring")
        if "Study & Exam Planning Workshop" not in recommendations:
            recommendations.append("Study & Exam Planning Workshop")

    if "wellbeing" in topics or trend_result.get("status") in ["support_recommended", "urgent_support_pathway"]:
        if "Confidential Wellbeing Advisor" not in recommendations:
            recommendations.append("Confidential Wellbeing Advisor")
        if "Mindfulness & Sleep Hygiene Group" not in recommendations:
            recommendations.append("Mindfulness & Sleep Hygiene Group")

    if "financial" in topics:
        recommendations.append("Student Financial Advisory & Bursary Desk")

    if "social" in topics or any(s["name"] == "Social Connection" and s["direction"] == "down" for s in trend_result.get("signals", [])):
        recommendations.append("Student Community & Peer Mentorship Network")

    if "accommodation" in topics:
        recommendations.append("Campus Residence & Housing Advisory")

    # Workload or stress signals
    workload_up = any(s["name"] == "Academic Workload" and s["direction"] == "up" for s in trend_result.get("signals", []))
    stress_up = any(s["name"] == "Stress" and s["direction"] == "up" for s in trend_result.get("signals", []))

    if workload_up and "Academic Support & Peer Tutoring" not in recommendations:
        recommendations.append("Academic Support & Peer Tutoring")
    if stress_up and "Confidential Wellbeing Advisor" not in recommendations:
        recommendations.append("Confidential Wellbeing Advisor")

    # Fallbacks to ensure at least 3 helpful options
    defaults = [
        "Confidential Wellbeing Advisor",
        "Academic Support & Peer Tutoring",
        "Student Study & Life Planning Resources",
        "Peer Mentorship Network"
    ]
    for d in defaults:
        if len(recommendations) >= 3:
            break
        if d not in recommendations:
            recommendations.append(d)

    return recommendations[:3]
