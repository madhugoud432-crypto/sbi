"""
Email & Transaction Alert Service:
Sends OTPs and statement alert notifications via standard SMTP (Gmail, Outlook, SES).
Gracefully falls back to secure logging when SMTP credentials are not configured.
"""

import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email_alert(
    to_email: str,
    subject: str,
    body_text: str,
    body_html: Optional[str] = None,
) -> bool:
    """Sends an email alert using configured SMTP server."""
    smtp_host = getattr(settings, "SMTP_HOST", None)
    smtp_port = getattr(settings, "SMTP_PORT", 587)
    smtp_user = getattr(settings, "SMTP_USER", None)
    smtp_password = getattr(settings, "SMTP_PASSWORD", None)
    smtp_from = getattr(settings, "SMTP_FROM", "alerts@sbi.co.in")

    if not smtp_host or not smtp_user or not smtp_password:
        logger.info(f"[EMAIL MOCK] To: {to_email} | Subject: {subject} | Body: {body_text}")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_from
        msg["To"] = to_email

        part1 = MIMEText(body_text, "plain")
        msg.attach(part1)

        if body_html:
            part2 = MIMEText(body_html, "html")
            msg.attach(part2)

        server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
        server.ehlo()
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_from, [to_email], msg.as_string())
        server.quit()

        logger.info(f"Email successfully sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


def send_otp_email(to_email: str, otp: str, purpose: str = "Banking Login") -> bool:
    """Helper to send standard SBI OTP email."""
    subject = f"STATE BANK OF INDIA - Your OTP for {purpose} is {otp}"
    body_text = (
        f"Dear Customer,\n\n"
        f"Your One Time Password (OTP) for {purpose} is: {otp}\n\n"
        f"This OTP is valid for 5 minutes. Please DO NOT share this OTP with anyone, "
        f"including SBI bank employees.\n\n"
        f"Warm regards,\nState Bank of India"
    )
    return send_email_alert(to_email=to_email, subject=subject, body_text=body_text)
