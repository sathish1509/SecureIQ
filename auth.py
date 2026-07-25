"""
Authentication & JWT Utilities for SecureIQ Backend.
Provides password hashing via bcrypt, stateless JWT token generation/verification,
and Flask request authorization decorators.
"""

from __future__ import annotations

import functools
import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from flask import jsonify, request

JWT_SECRET = os.getenv("JWT_SECRET", "secureiq_enterprise_secret_jwt_key_2026")
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def check_password(password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def generate_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_id,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=24)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> int | None:
    if not token:
        return None
    try:
        if token.lower().startswith("bearer "):
            token = token.split(" ", 1)[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("user_id")
    except Exception:
        return None


def get_optional_user_id(req=None) -> int | None:
    if req is None:
        req = request
    auth_header = req.headers.get("Authorization", "")
    if not auth_header:
        return None
    return verify_token(auth_header)


def require_auth(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_optional_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized. Please provide a valid Authorization Bearer token."}), 401
        return f(current_user_id=user_id, *args, **kwargs)

    return decorated_function
