import logging
from app.models.user import User
from app.models.car import Car
from app.models.service import Service
from app.database.database import db
from app.utils.constants import (
    RETRIEVAL_SUCCESS,
    ERROR_NO_USERS_FOUND,
    ERROR_NO_CARS_FOUND,
    ERROR_NO_SERVICES_FOUND,
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
                return []
        except Exception as e:
            logger.error(f"Error in get_all_users: {str(e)}")
            return []
    
    @staticmethod
    def get_all_cars():
        try:
            cars = Car.query.all()
            if cars:
                logger.info(RETRIEVAL_SUCCESS)
                return cars
            else:
                logger.warning(ERROR_NO_CARS_FOUND)
                return []
        except Exception as e:
            logger.error(f"Error in get_all_cars: {str(e)}")
            return []

    @staticmethod
    def get_services_with_car_name():
        try:
            services = (
                db.session.query(Service, Car.name.label("car_name"))
                .join(Car, Service.car_id == Car.car_id)
                .all()
            )
            if services:
                logger.info(RETRIEVAL_SUCCESS)
                service_list = []
                for service, car_name in services:
                    service_list.append({
                        "service_id": service.service_id,
                        "car_id": service.car_id,
                        "car_name": car_name,
                        "mileage": service.mileage,
                        "service_type": service.service_type,
                        "service_date": service.service_date,
                        "next_service_date": service.next_service_date,
                        "cost": service.cost,
                        "notes": service.notes,
                    })
                return service_list
            else:
                logger.warning(ERROR_NO_SERVICES_FOUND)
                return []
        except Exception as e:
            logger.error(f"Error in get_all_services: {str(e)}")
            return []

    @staticmethod
    def get_total_users():
        try:
            return User.query.count()
        except Exception as e:
            logger.error(f"Error in get_total_users: {str(e)}")
            return 0

    @staticmethod
    def get_total_cars():
        try:
            return Car.query.count()
        except Exception as e:
            logger.error(f"Error in get_total_cars: {str(e)}")
            return 0

    @staticmethod
    def get_total_services():
        try:
            return Service.query.count()
        except Exception as e:
            logger.error(f"Error in get_total_services: {str(e)}")
            return 0
