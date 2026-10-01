import re
from typing import Dict, Any, List

def generate_companion_reply(user_message: str) -> Dict[str, Any]:
    """
    Campus Companion rule-based navigation assistant.
    Provides empathetic, non-diagnostic guidance connecting students to human campus support services.
    """
    text = user_message.lower().strip()

    # Crisis / Immediate Distress Check
    crisis_terms = ["suicide", "end my life", "harm myself", "kill myself", "die", "can't go on", "emergency"]
    if any(term in text for term in crisis_terms):
        return {
            "reply": "If you are in immediate danger or experiencing an acute crisis, please reach out right away. You are not alone. Please contact Campus Emergency Support at +91-XXXXXXXXXX or the 24/7 Student Crisis Helpline at +91-XXXXXXXXXX. Immediate human support is available.",
            "suggested_actions": ["Emergency Helplines", "Talk to On-Call Advisor", "Request Urgent Callback"],
            "category_detected": "urgent"
        }

    # Academic Stress & Exams
    if any(k in text for k in ["exam", "assignment", "deadline", "coursework", "grades", "failing", "study", "workload", "homework", "lecture", "classes"]):
        return {
            "reply": "It sounds like academic pressures are piling up right now. Many students experience heavy workload peaks around deadlines and exam weeks. Campus Academic Support offers peer tutoring, study scheduling, and extension advisory. Would you like to connect with an academic advisor or explore study resources?",
            "suggested_actions": ["Explore Academic Support", "Book Peer Tutoring", "Request Advisor Callback"],
            "category_detected": "academic"
        }

    # Sleep & Exhaustion
    if any(k in text for k in ["sleep", "insomnia", "tired", "exhausted", "nightmare", "rest", "drained", "can't sleep"]):
        return {
            "reply": "Sleep disruptions and physical exhaustion can make everything feel much harder to carry. The Student Wellbeing Center hosts regular sleep hygiene sessions and quiet rest spaces. You can also talk to a wellbeing advisor about practical ways to recharge.",
            "suggested_actions": ["Sleep & Rest Resources", "Connect with Wellbeing Advisor", "Log in Wellbeing Check-in"],
            "category_detected": "wellbeing"
        }

    # Social & Loneliness
    if any(k in text for k in ["lonely", "isolated", "friends", "homesick", "roommate", "social", "left out", "alone"]):
        return {
            "reply": "Feeling disconnected or lonely can feel very heavy, especially during a demanding semester. The Student Life Office and Peer Mentorship Network organize weekly community meetups, clubs, and peer coffee hours to help you meet people in a low-pressure environment.",
            "suggested_actions": ["Student Community & Clubs", "Peer Mentorship Network", "Campus Events Calendar"],
            "category_detected": "social"
        }

    # Financial & Fees
    if any(k in text for k in ["money", "tuition", "fee", "fees", "afford", "bursary", "loan", "financial", "rent", "cost", "groceries"]):
        return {
            "reply": "Financial worries can create significant strain alongside your studies. The University Student Financial Aid Desk provides confidential emergency hardship bursaries, fee installment planning, and budgeting counseling.",
            "suggested_actions": ["Financial Aid Desk", "Emergency Hardship Fund", "Speak with Financial Advisor"],
            "category_detected": "financial"
        }

    # General Stress or Overwhelm
    if any(k in text for k in ["stress", "overwhelmed", "anxious", "anxiety", "panic", "burnout", "burnt out", "help", "struggling"]):
        return {
            "reply": "Thank you for sharing how you're feeling. Acknowledging that things feel overwhelming is an important first step. The Campus Wellbeing team is here to listen and help you figure out practical next steps without any judgment. Would you like to request a confidential check-in chat?",
            "suggested_actions": ["Request Confidential Support", "Find Wellbeing Resources", "Take Weekly Check-in"],
            "category_detected": "wellbeing"
        }

    # Default friendly navigation response
    return {
        "reply": "Hello! I'm Campus Companion, your university support guide. I can help connect you with Academic Support, Wellbeing Advisors, Financial Aid, or Student Community initiatives. How can we support you today?",
        "suggested_actions": ["Start Wellbeing Check-in", "Browse Support Directory", "Speak to a Human Advisor"],
        "category_detected": "general"
    }
