import logging
from app.models.user import User
from app.utils.constants import (
    RETRIEVAL_SUCCESS,
    ERROR_NO_USERS_FOUND,
    ERROR_USERNAME_NOT_FOUND,
)


logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(module)s - Line: %(lineno)d - %(message)s",
)
logger = logging.getLogger(__name__)


class AdminService:
    @staticmethod
    def get_all_users():
        try:
            users = User.query.all()
            if users:
                logger.info(RETRIEVAL_SUCCESS)
                return users
            else:
                logger.warning(ERROR_NO_USERS_FOUND)
        except Exception as e:
            logger.error(f"Error in get_all_users: {str(e)}")
            return None

    @staticmethod
    def get_user_by_username(username):
        try:
            user = User.query.filter_by(username=username).first()
            if user:
                logger.info(RETRIEVAL_SUCCESS)
                return user
            else:
                logger.warning(ERROR_USERNAME_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in get_user_by_username: {str(e)}")
            return None
