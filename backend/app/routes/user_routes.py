from datetime import datetime
from flask import Blueprint, jsonify, request
from app.services.user_service import UserService
from app.utils.auth_utils import token_required
from app.utils.logging_config import logger
from app.utils.constants import (
    ERROR_FETCHING_DATA,
    ERROR_NO_USERS_FOUND,
    ERROR_USER_NOT_FOUND,
    ERROR_NO_CARS_FOUND,
    ERROR_CAR_NOT_FOUND,
    ERROR_SERVICE_NOT_FOUND,
    ERROR_NO_SERVICES_FOUND,
)

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/dashboard_home_user", methods=["GET"])
@token_required
def load_dashboard_data(current_user):
    total_cars = UserService.get_total_cars(current_user)
    total_services = UserService.get_total_services(current_user)

    return (
        jsonify({"total_cars": total_cars, "total_services": total_services}),
        200,
    )
