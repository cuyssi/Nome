import os
import json
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from pywebpush import webpush, WebPushException
from collections.abc import Mapping

load_dotenv()

router = APIRouter()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_CLAIMS: Mapping[str, str] = {"sub": "mailto:cuyssi@hotmail.com"}

subscriptions = []

class Subscription(BaseModel):
    endpoint: str
    keys: Dict[str, str]

# Endpoints
@router.get("/vapid-public-key/")
def get_vapid_public_key():
    return {"publicKey": VAPID_PUBLIC_KEY}

@router.post("/subscribe/")
def subscribe(sub: Subscription):
    subscriptions.append(sub.dict())
    return {"ok": True}

def send_push(sub, title, body):
    try:
        webpush(
            subscription_info=sub,
            data=json.dumps({"title": title, "body": body}),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=dict(VAPID_CLAIMS)
        )
    except WebPushException as e:
        print("❌ Error enviando push:", e)
