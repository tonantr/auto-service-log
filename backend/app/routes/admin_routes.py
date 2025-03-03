import logging
from flask import Blueprint, jsonify, request
from app.services.admin_service import AdminService
from app.utils.auth_utils import token_required
from app.utils.logging_config import logger
from app.utils.constants import (
    ERROR_FETCHING_DATA,
    ERROR_NO_USERS_FOUND,
    ERROR_USER_NOT_FOUND,
    ERROR_NO_CARS_FOUND,
    ERROR_NO_SERVICES_FOUND
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

@admin_bp.route('/dashboard_home', methods=['GET'])
@token_required
def get_dashboard_data(current_user):
    try:
        total_users = AdminService.get_total_users()
        total_cars = AdminService.get_total_cars()
        total_services = AdminService.get_total_services()
        
        return jsonify({
            'total_users': total_users,
            'total_cars': total_cars,
            'total_services': total_services
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
    


