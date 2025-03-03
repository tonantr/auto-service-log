import logging
from sqlalchemy.sql import or_
from app.models.user import User
from app.models.car import Car
from app.models.service import Service
from app.utils.logging_config import logger
from app.database.database import db
from app.utils.auth_utils import hash_password
from app.utils.validation import validate_username_and_email
from app.utils.constants import (
    ADD_SUCCESS,
    UPDATE_SUCCESS,
    DELETE_SUCCESS,
    ERROR_NO_USERS_FOUND,
    ERROR_USER_NOT_FOUND,
    ERROR_NO_CARS_FOUND,
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
            return {"message": "Error in delete_user."}

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
