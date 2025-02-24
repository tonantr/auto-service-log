import logging
from app.models.user import User
from app.utils.constants import (
    RETRIEVAL_SUCCESS,
    ERROR_NO_USERS_FOUND,
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
    def get_total_users():
        try:
            return User.query.count()
        except Exception as e:
            logger.error(f"Error in get_total_users: {str(e)}")
            return None


