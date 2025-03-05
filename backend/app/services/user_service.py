from sqlalchemy.sql import or_
from sqlalchemy.orm import load_only
from app.models.user import User
from app.models.car import Car
from app.models.service import Service
from app.utils.logging_config import logger
from app.database.database import db
from app.utils.auth_utils import hash_password
from app.utils.validation import validate_username_and_email, validate_vin
from app.utils.constants import (
    ADD_SUCCESS,
    UPDATE_SUCCESS,
    DELETE_SUCCESS,
    ERROR_CAR_NOT_FOUND,
    ERROR_NO_USERS_FOUND,
    ERROR_USER_NOT_FOUND,
    ERROR_NO_CARS_FOUND,
    ERROR_SERVICE_NOT_FOUND,
    ERROR_NO_SERVICES_FOUND,
)

class UserService:
    @staticmethod
    def get_total_cars(current_user):
        try:
            return Car.query.filter_by(user_id = current_user.user_id).count()
        except Exception as e:
            logger.error(f"Error in get_total_cars: {str(e)}")
            return 0
    
    @staticmethod
    def get_total_services(current_user):
        try:
            return db.session.query(Service).join(Car).filter(Car.user_id == current_user.user_id).count()
        except Exception as e:
            logger.error(f"Error in get_total_services: {str(e)}")
            return 0