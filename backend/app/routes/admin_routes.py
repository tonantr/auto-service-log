from datetime import datetime
from flask import Blueprint, jsonify, request
from app.services.admin_service import AdminService
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
    ERROR_NO_LOGS_LOGIN_FOUND,
)

admin_bp = Blueprint("admin_bp", __name__)


@admin_bp.route("/users", methods=["GET"])
@token_required
def get_users(current_user):
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        users = AdminService.get_all_users(page=page, per_page=per_page)

        if users:
            return jsonify(users), 200
        else:
            logger.warning(ERROR_NO_USERS_FOUND)
            return jsonify(message=ERROR_NO_USERS_FOUND), 404

    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/users/list", methods=["GET"])
@token_required
def get_users_list(current_user):
    try:
        users = AdminService.get_users_list()

        if users:
            return jsonify(users), 200
        else:
            logger.warning(ERROR_NO_USERS_FOUND)
            return jsonify(message=ERROR_NO_USERS_FOUND), 404
    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/user/<int:user_id>", methods=["GET"])
@token_required
def get_user(current_user, user_id):
    try:
        user = AdminService.get_user(user_id)

        if user:
            return jsonify(user), 200
        else:
            logger.warning(ERROR_USER_NOT_FOUND)
            return jsonify(message=ERROR_USER_NOT_FOUND), 404
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/add_user", methods=["POST"])
@token_required
def add_user(current_user):
    try:
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'user') 

        response = AdminService.add_user(username, email, password, role)
        if "Error" in response["message"]:
            return jsonify(response), 400

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error in add_user: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/update_user/<int:user_id>", methods=["PUT"])
@token_required
def update_user(current_user, user_id):
    try:
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role') 

        response = AdminService.update_user(user_id, username, email, password, role)
        if "Error" in response["message"]:
            return jsonify(response), 400
        
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Error in update_user: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/delete_user/<int:user_id>", methods=["DELETE"])
@token_required
def delete_user(current_user, user_id):
    try:   
        response, status_code = AdminService.delete_user(current_user, user_id) 
        return jsonify(response), status_code 
    
    except Exception as e:
        logger.error(f"Error in delete_user: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/cars", methods=["GET"])
@token_required
def get_cars(current_user):
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        cars = AdminService.get_cars_with_user_name(page=page, per_page=per_page)

        if cars:
            return jsonify(cars), 200
        else:
            logger.warning(ERROR_NO_CARS_FOUND)
            return jsonify(message=ERROR_NO_CARS_FOUND), 404

    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/cars/list", methods=["GET"])
@token_required
def get_cars_list(current_user):
    try:
        cars = AdminService.get_cars_list()

        if cars:
            return jsonify(cars), 200
        else:
            logger.warning(ERROR_NO_CARS_FOUND)
            return jsonify(message=ERROR_NO_CARS_FOUND), 404
    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/car/<int:car_id>", methods=["GET"])
@token_required
def get_car(current_user, car_id):
    try:
        car = AdminService.get_car(car_id)

        if car:
            return jsonify(car), 200
        else:
            logger.warning(ERROR_CAR_NOT_FOUND)
            return jsonify(message=ERROR_CAR_NOT_FOUND), 404
    except Exception as e:
        logger.error(f"Error in get_car: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/add_car", methods=["POST"])
@token_required
def add_car(current_user):
    try:
        data = request.get_json()

        user_id = data.get('userID')
        name = data.get('name')
        model = data.get('model')
        year = data.get('year') 
        vin = data.get('vin')

        response = AdminService.add_car(user_id, name, model, year, vin)
        if "Error" in response["message"]:
            return jsonify(response), 400

        return jsonify(response), 200
    except Exception as e:
        logger.error(f"Error in add_car: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/update_car/<int:car_id>", methods=["PUT"])
@token_required
def update_car(current_user, car_id):
    try:
        data = request.get_json()

        name = data.get("name")
        model = data.get("model")
        year = data.get("year")
        vin = data.get("vin")

        response = AdminService.update_car(car_id, name, model, year, vin)

        if "Error" in response["message"]:
            return jsonify(response), 400
        
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error in update_car: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/delete_car/<int:car_id>", methods=["DELETE"])
@token_required
def delete_car(current_user, car_id):
    try:   
        response, status_code = AdminService.delete_car(car_id) 
        return jsonify(response), status_code 
    
    except Exception as e:
        logger.error(f"Error in delete_car: {str(e)}", exc_info=True) 
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/services", methods=["GET"])
@token_required
def get_services(current_user):
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        services = AdminService.get_services_with_car_name(page=page, per_page=per_page)

        if services:
             return jsonify(services), 200
        else:
            logger.warning(ERROR_NO_SERVICES_FOUND)
            return jsonify(message=ERROR_NO_SERVICES_FOUND), 404

    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/service/<int:service_id>", methods=["GET"])
@token_required
def get_service(current_user, service_id):
    try:
        service = AdminService.get_service(service_id)

        if service:
            return jsonify(service), 200
        else:
            logger.warning(ERROR_SERVICE_NOT_FOUND)
            return jsonify(message=ERROR_SERVICE_NOT_FOUND), 404
    except Exception as e:
        logger.error(f"Error in get_service: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/add_service", methods=["POST"])
@token_required
def add_service(current_user):
    try:
        data = request.get_json()
        car_id = data.get("carID")  
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
        
        response = AdminService.add_service(car_id, mileage, service_type, service_date, next_service_date, cost, notes)
        if "Error" in response["message"]:
            return jsonify(response), 400

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error in add_service: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/update_service/<int:service_id>", methods=["PUT"])
@token_required
def update_service(current_user, service_id):
    try:
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

        response = AdminService.update_service(service_id, mileage, service_type, service_date, next_service_date, cost, notes)
        if "Error" in response["message"]:
            return jsonify(response), 400

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error in update_service: {str(e)}")
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/delete_service/<int:service_id>", methods=["DELETE"])
@token_required
def delete_service(current_user, service_id):
    try:
        response, status_code = AdminService.delete_service(service_id)
        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Error in delete_service: {str(e)}", exc_info=True) 
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route("/logs_login", methods=["GET"])
@token_required
def get_logs_login(current_user):
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        logs_login = AdminService.get_logs_login(page=page, per_page=per_page)

        if logs_login:
            return jsonify(logs_login), 200
        else:
            logger.warning(ERROR_NO_LOGS_LOGIN_FOUND)
            return jsonify(message=ERROR_NO_LOGS_LOGIN_FOUND), 404

    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/delete_log/<int:log_id>", methods=["DELETE"])
@token_required
def delete_log_login(current_user, log_id):
    try:
        response, status_code = AdminService.delete_log_login(log_id)
        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Error in delete_log_login: {str(e)}", exc_info=True) 
        return jsonify({"message": "An unexpected error occurred."}), 500

@admin_bp.route('/dashboard_home', methods=['GET'])
@token_required
def get_dashboard_data(current_user):
    try:
        total_users = AdminService.get_total_users()
        total_cars = AdminService.get_total_cars()
        total_services = AdminService.get_total_services()
        total_visitors = AdminService.get_total_user_visits()
        
        return jsonify({
            'total_users': total_users,
            'total_cars': total_cars,
            'total_services': total_services,
            'total_visitors': total_visitors,
        }), 200
    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500
    
@admin_bp.route('/search', methods=['GET'])
@token_required
def search(current_user):
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        query = request.args.get('query', '')

        if not query:
            return jsonify({'users': [], 'cars': [], 'services': []})
        
        result = AdminService.search(query, page=page, per_page=per_page)

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500
    


