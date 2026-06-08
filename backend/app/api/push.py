from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.push_subscription import PushSubscription
from pydantic import BaseModel
from typing import Optional
import json, os
from pywebpush import webpush, WebPushException

router = APIRouter(prefix="/push", tags=["push"])

VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_EMAIL = os.getenv("VAPID_EMAIL", "mailto:admin@pulsohr.ru")

class SubscriptionData(BaseModel):
    endpoint: str
    p256dh: str
    auth: str
    user_id: Optional[str] = None

@router.post("/subscribe")
def subscribe(data: SubscriptionData, db: Session = Depends(get_db)):
    existing = db.query(PushSubscription).filter(
        PushSubscription.endpoint == data.endpoint
    ).first()
    if existing:
        return {"message": "Уже подписан"}

    sub = PushSubscription(
        user_id=data.user_id,
        endpoint=data.endpoint,
        p256dh=data.p256dh,
        auth=data.auth
    )
    db.add(sub)
    db.commit()
    return {"message": "Подписка сохранена"}

@router.get("/public-key")
def get_public_key():
    return {"public_key": VAPID_PUBLIC_KEY}

def send_push_to_all(db: Session, title: str, body: str, survey_id: str):
    subscriptions = db.query(PushSubscription).all()
    for sub in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {
                        "p256dh": sub.p256dh,
                        "auth": sub.auth
                    }
                },
                data=json.dumps({
                    "title": title,
                    "body": body,
                    "survey_id": survey_id
                }),
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims={"sub": VAPID_EMAIL}
            )
        except WebPushException:
            db.delete(sub)
            db.commit()