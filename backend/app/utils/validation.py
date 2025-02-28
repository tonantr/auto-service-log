from app.models.user import User
from app.utils.logging_config import logger
from app.utils.constants import (
    ERROR_USERNAME_EXISTS,
    ERROR_EMAIL_EXISTS,
)


def validate_username_and_email(username, email):
    existing_user = User.query.filter_by(username=username).first()
    existing_email = User.query.filter_by(email=email).first()

    if existing_user:
        logger.warning(ERROR_USERNAME_EXISTS)
        return {"message": ERROR_USERNAME_EXISTS}

    if existing_email:
        logger.warning(ERROR_EMAIL_EXISTS)
        return {"message": ERROR_EMAIL_EXISTS}
    
    return None
