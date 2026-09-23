import redis
import time
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class InMemoryRedis:
    def __init__(self):
        self._store = {}
        logger.warning("[WARNING] Redis connection failed. Falling back to InMemoryRedis.")

    def set(self, key: str, value: str, ex: int = None, px: int = None, nx: bool = False, xx: bool = False):
        expire_at = (time.time() + ex) if ex else None
        self._store[key] = (value, expire_at)
        return True

    def setex(self, key: str, time_to_live: int, value: str):
        return self.set(key, value, ex=time_to_live)

    def get(self, key: str) -> str | None:
        if key not in self._store:
            return None
        value, expire_at = self._store[key]
        if expire_at and time.time() > expire_at:
            del self._store[key]
            return None
        return value

    def delete(self, *keys: str) -> int:
        count = 0
        for key in keys:
            if key in self._store:
                del self._store[key]
                count += 1
        return count

    def exists(self, key: str) -> int:
        return 1 if self.get(key) is not None else 0

_client = None

def get_redis():
    global _client
    if _client is None:
        try:
            client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            # Test connection
            client.ping()
            _client = client
            logger.info("Successfully connected to Redis.")
        except Exception as e:
            logger.warning(f"Failed to connect to Redis at {settings.REDIS_URL}: {e}. Using InMemoryRedis fallback.")
            _client = InMemoryRedis()
    return _client


def set_otp(key: str, otp: str, expire_seconds: int = None) -> None:
    r = get_redis()
    expire = expire_seconds or (settings.OTP_EXPIRE_MINUTES * 60)
    r.setex(f"otp:{key}", expire, otp)


def get_otp(key: str) -> str | None:
    r = get_redis()
    return r.get(f"otp:{key}")


def delete_otp(key: str) -> None:
    r = get_redis()
    r.delete(f"otp:{key}")


def blacklist_token(jti: str, expire_seconds: int) -> None:
    r = get_redis()
    r.setex(f"blacklist:{jti}", expire_seconds, "1")


def is_token_blacklisted(jti: str) -> bool:
    r = get_redis()
    return r.exists(f"blacklist:{jti}") == 1


def set_session(session_id: str, data: str, expire_seconds: int = 1800) -> None:
    r = get_redis()
    r.setex(f"session:{session_id}", expire_seconds, data)


def set_captcha(captcha_id: str, text: str, expire_seconds: int = 300) -> None:
    r = get_redis()
    r.setex(f"captcha:{captcha_id}", expire_seconds, text)


def get_captcha(captcha_id: str) -> str | None:
    r = get_redis()
    return r.get(f"captcha:{captcha_id}")


def get_session(session_id: str) -> str | None:
    r = get_redis()
    return r.get(f"session:{session_id}")


def delete_session(session_id: str) -> None:
    r = get_redis()
    r.delete(f"session:{session_id}")
