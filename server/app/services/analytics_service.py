from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models
import logging

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def track_event(
        self, 
        user_id: str, 
        event_type: str, 
        category: str, 
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Log an event for admin monitoring and user analytics.
        In a production app, this might also send data to Google Analytics (GTags).
        """
        # For now, we log to stdout and could save to a dedicated 'ActivityLog' table if it existed.
        # logger.info(f"Analytics Event: {event_type} | User: {user_id} | Metadata: {metadata}")
        
        # Example of saving to a generic activity log (assuming model exists or is created)
        # log_entry = models.ActivityLog(
        #     user_id=user_id,
        #     event_type=event_type,
        #     category=category,
        #     metadata=metadata
        # )
        # self.db.add(log_entry)
        # await self.db.commit()
        pass

    async def get_system_stats(self) -> Dict[str, Any]:
        """
        Aggregate stats for the admin dashboard.
        """
        # This is a placeholder for real aggregation queries
        return {
            "total_users": 150,
            "active_sessions": 24,
            "total_courses": 12,
            "avg_completion_rate": "68%",
            "system_health": "Optimal",
            "ai_api_usage": "32%",
            "top_courses": [
                {"id": 1, "title": "AI Fundamentals", "enrollments": 450},
                {"id": 2, "title": "Advanced Web Dev", "enrollments": 320}
            ]
        }

    async def get_activity_feed(self, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get recent activity for the admin activity monitor.
        """
        return [
            {"id": 1, "user": "Mujtaba", "action": "Completed Lesson 1.2", "time": "2 mins ago", "severity": "info"},
            {"id": 2, "user": "AI Agent", "action": "Generated new study plan", "time": "5 mins ago", "severity": "success"},
            {"id": 3, "user": "System", "action": "High CPU detected on Vector DB", "time": "12 mins ago", "severity": "warning"},
            {"id": 4, "user": "Guest", "action": "Signed up for AI course", "time": "15 mins ago", "severity": "info"}
        ]
