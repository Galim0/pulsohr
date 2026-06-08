from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.sqlite import TEXT
from app.core.database import Base
from datetime import datetime
import uuid

class PushSubscription(Base):
    __tablename__ = "push_subscriptions"

    id = Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(TEXT, nullable=True)
    endpoint = Column(TEXT, nullable=False)
    p256dh = Column(TEXT, nullable=False)
    auth = Column(TEXT, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)