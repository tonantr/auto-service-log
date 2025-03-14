from datetime import datetime
from flask import Blueprint, jsonify, request
from app.services.user_service import UserService
from app.utils.auth_utils import token_required
from app.utils.logging_config import logger
from app.utils.constants import (
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


@user_bp.route("/profile", methods=["GET"])
@token_required
def load_profile(current_user):
    user_profile = UserService.get_profile(current_user)

    if user_profile is None:
        return jsonify({"message": ERROR_USER_NOT_FOUND}), 404

    return jsonify(user_profile.to_dict()), 200


@user_bp.route("/update_profile", methods=["PUT"])
@token_required
def update_profile(current_user):
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    response = UserService.update_profile(current_user, username, email, password)
    if "Error" in response["message"]:
            return jsonify(response), 400
        
    return jsonify(response), 200


@user_bp.route("/cars", methods=["GET"])
@token_required
def load_cars(current_user):
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    cars = UserService.get_cars_for_user(current_user, page=page, per_page=per_page)

    if not cars:
        return jsonify({"message": ERROR_NO_CARS_FOUND}), 404
    
    return jsonify(cars), 200


@user_bp.route("/cars/ids-and-names", methods=["GET"])
@token_required
def get_all_car_ids_and_names(current_user):
    cars = UserService.get_all_car_ids_and_names(current_user)

    if not cars:
        return jsonify({"message": ERROR_NO_CARS_FOUND}), 404
    
    return jsonify(cars), 200


@user_bp.route("/car/<int:car_id>", methods=["GET"])
@token_required
def get_car(current_user, car_id):
    car = UserService.get_car(car_id)

    if not car:
        return jsonify({"message": ERROR_CAR_NOT_FOUND}), 404
    
    return jsonify(car), 200


@user_bp.route("/add_car", methods=["POST"])
@token_required
def add_car(current_user):
    data = request.get_json()

    name = data.get("name")
    model = data.get("model")
    year = data.get("year")
    vin = data.get("vin")

    response = UserService.add_car(current_user, name, model, year, vin)
    if "Error" in response["message"]:
        return jsonify(response), 400
    
    return jsonify(response), 200


@user_bp.route("/update_car/<int:car_id>", methods=["PUT"])
@token_required
def update_car(current_user, car_id):
    data = request.get_json()

    name = data.get("name")
    model = data.get("model")
    year = data.get("year")
    vin = data.get("vin")

    response = UserService.update_car(car_id, name, model, year, vin)

    if "Error" in response["message"]:
        return jsonify(response), 400
        
    return jsonify(response), 200


@user_bp.route("/delete_car/<int:car_id>", methods=["DELETE"])
@token_required
def delete_car(current_user, car_id):
    response = UserService.delete_car(car_id)

    if "Error" in response["message"]:
        return jsonify(response), 400
        
    return jsonify(response), 200


@user_bp.route("/services", methods=["GET"])
@token_required
def load_services(current_user):
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    car_id = request.args.get("car_id", type=int)  

    services = UserService.get_services_for_car(car_id, page=page, per_page=per_page)

    if not services:
        return jsonify({"message": ERROR_NO_SERVICES_FOUND}), 404
    
    return jsonify(services), 200


@user_bp.route("/service/<int:service_id>", methods=["GET"])
@token_required
def get_service(current_user, service_id):
    service = UserService.get_service(service_id)

    if service:
        return jsonify(service), 200
    else:
        logger.warning(ERROR_SERVICE_NOT_FOUND)
        return jsonify(message=ERROR_SERVICE_NOT_FOUND), 404


@user_bp.route("/add_service", methods=["POST"])
@token_required
def add_service(current_user):
    data = request.get_json()
    car_id = data.get("car_id")  
    mileage = data.get("mileage")
    service_type = data.get("type") 
    service_date = data.get("date")  
    next_service_date = data.get("nextDate") 
    cost = data.get("cost")
    notes = data.get("notes")

    service_date = datetime.strptime(service_date, "%Y-%m-%d").date()

    if not next_service_date:
        next_service_date = None
    else:
        next_service_date = datetime.strptime(next_service_date, "%Y-%m-%d").date()

    mileage = int(mileage) if mileage else 0

    cost = float(cost) if cost else 0.0

    notes = notes if notes else None
        
    response = UserService.add_service(car_id, mileage, service_type, service_date, next_service_date, cost, notes)
    if "Error" in response["message"]:
        return jsonify(response), 400

    return jsonify(response), 200


@user_bp.route("/update_service/<int:service_id>", methods=["PUT"])
@token_required
def update_service(current_user, service_id):
    data = request.get_json()
    mileage = data.get("mileage")
    service_type = data.get("type") 
    service_date = data.get("date")  
    next_service_date = data.get("nextDate") 
    cost = data.get("cost")
    notes = data.get("notes")

    service_date = datetime.strptime(service_date, "%Y-%m-%d").date()

    if not next_service_date:
        next_service_date = None
    else:
        next_service_date = datetime.strptime(next_service_date, "%Y-%m-%d").date()

    mileage = int(mileage) if mileage else 0

    cost = float(cost) if cost else 0.0

    notes = notes if notes else None

    response = UserService.update_service(service_id, mileage, service_type, service_date, next_service_date, cost, notes)
    if "Error" in response["message"]:
        return jsonify(response), 400

    return jsonify(response), 200

   
@user_bp.route("/delete_service/<int:service_id>", methods=["DELETE"])
@token_required
def delete_service(current_user, service_id):
    response = UserService.delete_service(service_id)
    return jsonify(response), 200
    

@user_bp.route("/search", methods=['GET'])
@token_required
def search(current_user):
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    query = request.args.get('query', '')

    if not query:
        return jsonify({'cars': [], 'services': []})
        
    result = UserService.search(current_user, query, page=page, per_page=per_page)

    return jsonify(result), 200
