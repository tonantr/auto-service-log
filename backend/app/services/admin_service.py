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


class AdminService:
    @staticmethod
    def get_all_users(page=1, per_page=10):
        try:
            pagination = User.query.paginate(
                page=page, per_page=per_page, error_out=False
            )
            if pagination.items:
                users = [user.to_dict() for user in pagination.items]

                results = {
                    "users": users,
                    "total_users": pagination.total,
                    "total_pages": pagination.pages,
                    "current_page": pagination.page,
                    "per_page": pagination.per_page,
                }
                return results
            else:
                logger.warning(ERROR_NO_USERS_FOUND)
                return {
                    "users": [],
                    "total_users": 0,
                    "total_pages": 0,
                    "current_page": page,
                    "per_page": per_page,
                }
        except Exception as e:
            logger.error(f"Error in get_all_users: {str(e)}")
            return {
                "users": [],
                "total_users": 0,
                "total_pages": 0,
                "current_page": page,
                "per_page": per_page,
            }

    @staticmethod
    def get_users_list():
        try:
            users = User.query.options(load_only(User.user_id, User.username)).all()
            return [{"user_id": user.user_id, "username": user.username} for user in users]
        except Exception as e:
            logger.error(f"Error in get_users: {str(e)}")
            return []
        
    @staticmethod
    def get_user(user_id):
        try:
            user = User.query.get(user_id)
            if user:
                return user.to_dict()
        except Exception as e:
            logger.error(f"Error in get_user: {str(e)}")
            return None

    @staticmethod
    def add_user(username, email, password, role="user"):
        try:
            result = validate_username_and_email(username, email)
            if result:
                return result

            password = hash_password(password)
            new_user = User(
                username=username, email=email, password=password, role=role
            )
            db.session.add(new_user)
            db.session.commit()
            return {"message": ADD_SUCCESS}
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in add_user: {str(e)}")
            return {"message": "Error in add_user."}

    @staticmethod
    def update_user(user_id, username=None, email=None, password=None, role=None):
        try:
            user = User.query.get(user_id)
            if not user:
                logger.warning(ERROR_USER_NOT_FOUND)
                return {"message": ERROR_USER_NOT_FOUND}

            if username or email:
                result = validate_username_and_email(username, email)
                if result:
                    return result

            updated = False

            if username and username != user.username:
                user.username = username
                updated = True

            if email and email != user.email:
                user.email = email
                updated = True

            if password:
                user.password = hash_password(password)
                updated = True

            if role and role in ["admin", "user"] and role != user.role:
                user.role = role
                updated = True

            if updated:
                db.session.commit()
                return {"message": UPDATE_SUCCESS}
            else:
                return {"message": "No changes made."}

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in update_user: {str(e)}")
            return {"message": "Error in update_user."}

    @staticmethod
    def delete_user(current_user, user_id):
        if current_user.role == 'admin':
            if current_user.user_id == user_id:
                return {"message": "Admin cannot delete themselves."}, 400
        try:
            user = User.query.get(user_id)
            if not user:
                logger.warning(ERROR_USER_NOT_FOUND)
                return {"message": ERROR_USER_NOT_FOUND}, 404
            
            if user.role == 'admin':
                return {"message": "Admin cannot delete other admins."}, 400
            
            db.session.delete(user)
            db.session.commit()

            return {"message": DELETE_SUCCESS}, 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in delete_user: {str(e)}")
            return {"message": "An unexpected error occurred."}, 500

    @staticmethod
    def get_cars_with_user_name(page=1, per_page=10):
        try:
            pagination = (
                db.session.query(Car, User.username.label("owner"))
                .join(User, Car.user_id == User.user_id)
                .paginate(page=page, per_page=per_page, error_out=False)
            )
            if pagination.items:
                car_list = []
                for car, owner in pagination.items:
                    car_list.append(
                        {
                            "car_id": car.car_id,
                            "user_id": car.user_id,
                            "owner": owner,
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
            logger.error(f"Error in get_cars_with_user_name: {str(e)}")
            return {
                "cars": [],
                "total_cars": 0,
                "total_pages": 0,
                "current_page": page,
                "per_page": per_page,
            }

    @staticmethod
    def get_cars_list():
        try:
            cars = Car.query.options(load_only(Car.car_id, Car.name)).all()
            return [{"car_id": car.car_id, "name": car.name} for car in cars]
        except Exception as e:
            logger.error(f"Error in get_cars: {str(e)}")
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
    def add_car(user_id, name, model, year, vin):
        try:
            result = validate_vin(vin)
            if result:
                return result
            
            new_car = Car (
                user_id=user_id, name=name, model=model, year=year, vin=vin
            )
            db.session.add(new_car)
            db.session.commit()
            return {"message": ADD_SUCCESS}
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in add_car: {str(e)}")
            return {"message": "Error in add_car."}

    @staticmethod
    def update_car(car_id, name=None, model=None, year=None, vin=None):
        try:
            car = Car.query.get(car_id)
            if not car:
                logger.warning(ERROR_CAR_NOT_FOUND)
                return {"message": ERROR_CAR_NOT_FOUND}
            
            updated = False
            
            if vin and car.vin != vin:
                result = validate_vin(vin)
                if result:
                    return result
                car.vin = vin
                updated = True
            
            if name and car.name != name:
                car.name = name
                updated = True

            if model and car.model != model:
                car.model = model
                updated = True

            if year and car.year != year:
                car.year = year
                updated = True
            
            if updated:
                db.session.commit()
                return {"message": UPDATE_SUCCESS}
            else:
                return {"message": "No changes made."}
            
        except Exception as e:
            db.session.rollback()
            logger.error("Error in update_car")
            return {"message": "Error in update_car"}

    @staticmethod
    def delete_car(car_id):
        try:
            car = Car.query.get(car_id)
            if not car:
                logger.warning(ERROR_CAR_NOT_FOUND)
                return {"message": ERROR_CAR_NOT_FOUND}, 404
            
            db.session.delete(car)
            db.session.commit()
            
            return {"message": DELETE_SUCCESS}, 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in delete_car: {str(e)}")
            return {"message": "An unexpected error occurred."}, 500

    @staticmethod
    def get_services_with_car_name(page=1, per_page=10):
        try:
            pagination = (
                db.session.query(Service, Car.name.label("car_name"))
                .join(Car, Service.car_id == Car.car_id)
                .paginate(page=page, per_page=per_page, error_out=False)
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
            logger.error(f"Error in get_services_with_car_name: {str(e)}")
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
                return {"message": "No changes made."}

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in update_service: {str(e)}")
            return {"message": "An unexpected error occurred."}

    @staticmethod
    def delete_service(service_id):
        try:
            service = Service.query.get(service_id)
            if not service:
                logger.warning(ERROR_SERVICE_NOT_FOUND)
                return {"message": ERROR_SERVICE_NOT_FOUND}, 404
            
            db.session.delete(service)
            db.session.commit()

            return {"message": DELETE_SUCCESS}, 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in delete_service: {str(e)}")
            return {"message": "An unexpected error occurred."}, 500

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

    @staticmethod
    def search(query, page=1, per_page=10):
        if not query:
            return {"users": [], "cars": [], "services": []}
        try:
            users = User.query.filter(
                or_(
                    User.username.contains(query),
                    User.role.contains(query),
                    User.email.contains(query),
                )
            ).paginate(page=page, per_page=per_page, error_out=False)

            cars = Car.query.filter(
                or_(
                    Car.name.contains(query),
                    Car.model.contains(query),
                    Car.vin.contains(query),
                )
            ).paginate(page=page, per_page=per_page, error_out=False)

            services = Service.query.filter(
                or_(
                    Service.service_type.contains(query),
                    Service.mileage.contains(query),
                    Service.cost.contains(query),
                )
            ).paginate(page=page, per_page=per_page, error_out=False)

            return {
                "users": {
                    "data": [user.to_dict() for user in users.items],
                    "total": users.total,
                    "total_pages": users.pages,
                    "current_page": users.page,
                },
                "cars": {
                    "data": [
                        {**car.to_dict(), "username": car.user.username}
                        for car in cars.items
                    ],
                    "total": cars.total,
                    "total_pages": cars.pages,
                    "current_page": cars.page,
                },
                "services": {
                    "data": [
                        {
                            **service.to_dict(),
                            "car_name": service.car.name if service.car else None,
                        }
                        for service in services.items
                    ],
                    "total": services.total,
                    "total_pages": services.pages,
                    "current_page": services.page,
                },
            }

        except Exception as e:
            logger.error(f"Error in search: {str(e)}")
            return {"users": [], "cars": [], "services": []}
