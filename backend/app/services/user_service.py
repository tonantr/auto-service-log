from sqlalchemy import cast, String
from sqlalchemy.sql import or_
from sqlalchemy.orm import load_only
from app.models.user import User
from app.models.car import Car
from app.models.service import Service
from app.utils.logging_config import logger
from app.database.database import db
from app.utils.auth_utils import hash_password
from app.utils.validation import validate_email, validate_username, validate_vin
from app.utils.constants import (
    ADD_SUCCESS,
    UPDATE_SUCCESS,
    DELETE_SUCCESS,
    ERROR_CAR_NOT_FOUND,
    ERROR_USER_NOT_FOUND,
    ERROR_NO_CARS_FOUND,
    ERROR_SERVICE_NOT_FOUND,
    ERROR_NO_SERVICES_FOUND,
    NO_CHANGES_MADE,
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
    def update_profile(current_user, username=None, email=None, password=None):
        try:
            user = User.query.get(current_user.user_id)
            if not user:
                logger.warning(ERROR_USER_NOT_FOUND)
                return {"message": ERROR_USER_NOT_FOUND}
            
            updated = False

            if username and username != user.username:
                username_error = validate_username(username)
                if username_error:
                    return username_error
                user.username = username
                updated = True

            if email and email != user.email:
                email_error = validate_email(email)
                if email_error:
                    return email_error
                user.email = email
                updated = True

            if password:
                user.password = hash_password(password)
                updated = True

            if updated:
                db.session.commit()
                return {"message": UPDATE_SUCCESS}
            else:
                return {"message": NO_CHANGES_MADE}

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in update_profile: {str(e)}")
            return {"message": "An unexpected error occurred while updating the profile."}

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
    def get_all_car_ids_and_names(current_user):
        try:
            cars = Car.query.options(load_only(Car.car_id, Car.name)).filter(Car.user_id==current_user.user_id).all()
            return [{"car_id": car.car_id, "name": car.name} for car in cars]
        except Exception as e:
            logger.error(f"Error in get_all_car_ids_and_names: {str(e)}")
            return []

    @staticmethod
    def get_car(car_id):
        try:
            car = Car.query.get(car_id)
            if car:
                return car.to_dict()
        except Exception as e:
            logger.error(f"Error in get_car: {str(e)}")
            return None

    @staticmethod
    def add_car(current_user, name, model, year, vin):
        try:
            vin_error = validate_vin(vin)
            if vin_error:
                return vin_error
            
            new_car = Car(
                user_id = current_user.user_id, name = name, model = model, year = year, vin = vin
            )

            db.session.add(new_car)
            db.session.commit()
            return {"message": ADD_SUCCESS}
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in add_car: {str(e)}")
            return {"message": "An unexpected error occurred while adding the car."}

    @staticmethod
    def update_car(car_id, name=None, model=None, year=None, vin=None):
        try:
            car = Car.query.get(car_id)
            if not car:
                logger.warning(ERROR_CAR_NOT_FOUND)
                return {"message": ERROR_CAR_NOT_FOUND}
            
            updated = False

            if name and name != car.name:
                car.name = name
                updated = True
            
            if model and model != car.model:
                car.model = model
                updated = True
            
            if year and int(year) != car.year:
                car.year = year
                updated = True

            if vin and vin != car.vin:
                vin_error = validate_vin(vin)
                if vin_error:
                    return vin_error
                car.vin = vin
                updated = True
            
            if updated:
                db.session.commit()
                return {"message": UPDATE_SUCCESS}
            else:
                return {"message": NO_CHANGES_MADE}

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in update_car: {str(e)}")
            return {"message": "An unexpected error occurred while updating the car."}

    @staticmethod
    def delete_car(car_id):
        try:
            car = Car.query.get(car_id)
            if not car:
                logger.warning(ERROR_CAR_NOT_FOUND)
                return {"message": ERROR_CAR_NOT_FOUND}
            
            db.session.delete(car)
            db.session.commit()
            
            return {"message": DELETE_SUCCESS}
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in delete_car: {str(e)}")
            return {"message": "An unexpected error occurred."}

    @staticmethod
    def get_services_for_car(car_id, page=1, per_page=10):
        try:
            pagination = db.session.query(Service, Car.name.label("car_name")).join(Car).filter(Car.car_id == car_id).paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            if pagination.items:
                service_list = []
                for service, car_name in pagination.items:
                    service_list.append(
                        {
                            "service_id": service.service_id,
                            "car_id": service.car_id,
                            "car_name": car_name,
                            "mileage": service.mileage,
                            "service_type": service.service_type,
                            "service_date": service.service_date,
                            "next_service_date": service.next_service_date,
                            "cost": service.cost,
                            "notes": service.notes,
                        }
                    )

                result = {
                    "services": service_list,
                    "total_services": pagination.total,
                    "total_pages": pagination.pages,
                    "current_page": pagination.page,
                    "per_page": pagination.per_page,
                }
                return result
            else:
                logger.warning(ERROR_NO_SERVICES_FOUND)
                return {
                    "services": [],
                    "total_services": 0,
                    "total_pages": 0,
                    "current_page": page,
                    "per_page": per_page,
                }

        except Exception as e:
            logger.error(f"Error in get_services_for_car: {str(e)}")
            return {
                    "services": [],
                    "total_services": 0,
                    "total_pages": 0,
                    "current_page": page,
                    "per_page": per_page,
                }

    @staticmethod
    def get_service(service_id):
        try:
            service = Service.query.get(service_id)
            if service:
                return service.to_dict()
        except Exception as e:
            logger.error(f"Error in get_service: {str(e)}")
            return None

    @staticmethod
    def add_service(car_id, mileage, service_type, service_date, next_service_date, cost, notes):
        try:
            new_service = Service (
                car_id=car_id, mileage=mileage, service_type=service_type, service_date=service_date, next_service_date=next_service_date, cost=cost, notes=notes
            )
            db.session.add(new_service)
            db.session.commit()
            return {"message": ADD_SUCCESS}
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in add_service: {str(e)}")
            return {"message": "An unexpected error occurred."}

    @staticmethod
    def update_service(service_id, mileage=None, service_type=None, service_date=None, next_service_date=None, cost=None, notes=None):
        try:
            service = Service.query.get(service_id)
            if not service:
                logger.warning(ERROR_SERVICE_NOT_FOUND)
                return {"message": ERROR_SERVICE_NOT_FOUND}
            
            updated = False

            if mileage and service.mileage != mileage:
                service.mileage = mileage
                updated = True

            if service_type and service.service_type != service_type:
                service.service_type = service_type
                updated = True
            
            if service_date and service.service_date != service_date:
                service.service_date = service_date
                updated = True
            
            if next_service_date and service.next_service_date != next_service_date:
                service.next_service_date = next_service_date
                updated = True
            
            if cost and service.cost != cost:
                service.cost = cost
                updated = True
            
            if notes and service.notes != notes:
                service.notes = notes
                updated = True
            
            if updated:
                db.session.commit()
                return {"message": UPDATE_SUCCESS}
            else:
                return {"message": NO_CHANGES_MADE}

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in update_service: {str(e)}")
            return {"message": "An unexpected error occurred."}

    @staticmethod
    def delete_service(service_id):
        try:
            service = Service.query.filter_by(service_id=service_id).first()
            if not service:
                logger.warning(ERROR_SERVICE_NOT_FOUND)
                return {"message": ERROR_SERVICE_NOT_FOUND}
            
            db.session.delete(service)
            db.session.commit()

            return {"message": DELETE_SUCCESS}
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in delete_service: {str(e)}")
            return {"message": "An unexpected error occurred."}

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

    @staticmethod
    def search(current_user, query, page=1, per_page=10):
        if not query:
            return {"cars": [], "services": []}
        try:
            cars = Car.query.filter(
                Car.user_id == current_user.user_id,
                or_(
                    Car.name.contains(query),
                    Car.model.contains(query),
                    Car.year.contains(query),
                    Car.vin.contains(query),
                )
            ).paginate(page=page, per_page=per_page, error_out=False)

            services = Service.query.filter(
                Service.car.has(Car.user_id == current_user.user_id), 
                or_(
                    Service.mileage.contains(query),
                    Service.service_type.contains(query),
                    cast(Service.service_date, String).contains(query), 
                    Service.cost.contains(query),
                )
            ).paginate(page=page, per_page=per_page, error_out=False)

            return {
                "cars": {
                    "data": [car.to_dict() for car in cars.items],
                    "total": cars.total,
                    "total_pages": cars.pages,
                    "current_page": cars.page,
                },
                "services": {
                    "data": [service.to_dict() for service in services.items],
                    "total": services.total,
                    "total_pages": services.pages,
                    "current_page": services.page,
                },
            }

        except Exception as e:
            logger.error(f"Error in search: {str(e)}")
            return {"cars": [], "services": []}