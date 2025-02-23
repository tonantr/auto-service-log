import logging
from app.models.user import User


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
            logger.info("Successfully retrieved all users from the database.")
            return users
        except Exception as e:
            logger.error(f"Error in get_all_users: {str(e)}")
            return []
