import logging
from flask import Blueprint, jsonify, request
from app.services.admin_service import AdminService
from app.utils.auth_utils import token_required
from app.utils.logging_config import logger
from app.utils.constants import (
    ERROR_FETCHING_DATA,
    ERROR_NO_USERS_FOUND,
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
    


