from datetime import datetime
from app.utils.logging_config import logger
from app.database.database import db
from app.models.login_logs import LoginLogs
from app.utils.constants import ADD_SUCCESS


def log_login(user_id, ip_address):
    try:
        new_log = LoginLogs(
            user_id=user_id, login_time=datetime.now(), logout_time=None, ip_address=ip_address
        )
        db.session.add(new_log)
        db.session.commit()
        return {"message": ADD_SUCCESS}
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in log_login: {str(e)}")
        return None