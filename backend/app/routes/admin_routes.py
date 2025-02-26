import logging
from flask import Blueprint, jsonify, request
from app.services.admin_service import AdminService
from app.utils.constants import (
    ERROR_FETCHING_DATA,
    ERROR_NO_USERS_FOUND,
    ERROR_NO_CARS_FOUND,
    ERROR_NO_SERVICES_FOUND
)

admin_bp = Blueprint("admin_bp", __name__)

logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(module)s - Line: %(lineno)d - %(message)s",
)


@admin_bp.route("/users", methods=["GET"])
def get_users():
    try:
        users = AdminService.get_all_users()

        if users:
            return jsonify([user.to_dict() for user in users]), 200
        else:
            logging.warning(ERROR_NO_USERS_FOUND)
            return jsonify(message=ERROR_NO_USERS_FOUND), 404

    except Exception as e:
        logging.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/cars", methods=["GET"])
def get_cars():
    try:
        cars = AdminService.get_cars_with_user_name()

        if cars:
            return jsonify(cars), 200
        else:
            logging.warning(ERROR_NO_CARS_FOUND)
            return jsonify(message=ERROR_NO_CARS_FOUND), 404

    except Exception as e:
        logging.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route("/services", methods=["GET"])
def get_services():
    try:
        services = AdminService.get_services_with_car_name()

        if services:
            return jsonify(services), 200
        else:
            logging.warning(ERROR_NO_SERVICES_FOUND)
            return jsonify(message=ERROR_NO_SERVICES_FOUND), 404
        
    except Exception as e:
        logging.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500

@admin_bp.route('/dashboard_home', methods=['GET'])
def get_dashboard_data():
    try:
        total_users = AdminService.get_total_users()
        total_cars = AdminService.get_total_cars()
        total_services = AdminService.get_total_services()
        
        return jsonify({
            'total_users': total_users,
            'total_cars': total_cars,
            'total_services': total_services
        })
    except Exception as e:
        logging.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500
    

@admin_bp.route('/search', methods=['GET'])
def search():
    try:
        query = request.args.get('query', '')

        if not query:
            return jsonify({'users': [], 'cars': [], 'services': []})
        
        result = AdminService.search(query)

        return jsonify(result)

    except Exception as e:
        logging.error(f"{ERROR_FETCHING_DATA}: {e}", exc_info=True)
        return jsonify(message=ERROR_FETCHING_DATA), 500