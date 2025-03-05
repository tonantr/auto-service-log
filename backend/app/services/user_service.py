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
    def get_profile(current_user):
        try:
            return User.query.get(current_user.user_id)
        except Exception as e:
            logger.error(f"Error in get_profile: {str(e)}")
            return None

    @staticmethod
    def get_cars_for_user(current_user, page=1, per_page=10):
        try:
            pagination = Car.query.filter_by(user_id=current_user.user_id).paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            if pagination.items:
                car_list = []
                for car in pagination.items:
                    car_list.append(
                        {
                            "car_id": car.car_id,
                            "user_id": car.user_id,
                            "name": car.name,
                            "model": car.model,
                            "year": car.year,
                            "vin": car.vin,
                        }
                    )

                result = {
                        "cars": car_list,
                        "total_cars": pagination.total,
                        "total_pages": pagination.pages,
                        "current_page": pagination.page,
                        "per_page": pagination.per_page,
                }
                return result
            else:
                logger.warning(ERROR_NO_CARS_FOUND)
                return []

        except Exception as e:
            logger.error(f"Error in get_cars_for_user: {str(e)}")
            return {
                "cars": [],
                "total_cars": 0,
                "total_pages": 0,
                "current_page": page,
                "per_page": per_page,
            }

    @staticmethod
    def get_total_cars(current_user):
        try:
            return Car.query.filter_by(user_id=current_user.user_id).count()
        except Exception as e:
            logger.error(f"Error in get_total_cars: {str(e)}")
            return 0

    @staticmethod
    def get_total_services(current_user):
        try:
            return (
                db.session.query(Service)
                .join(Car)
                .filter(Car.user_id == current_user.user_id)
                .count()
            )
        except Exception as e:
            logger.error(f"Error in get_total_services: {str(e)}")
            return 0
