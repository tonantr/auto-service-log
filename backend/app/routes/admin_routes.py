import logging
from flask import Blueprint, jsonify
from app.services.admin_service import AdminService
from app.utils.constants import (
    ERROR_FETCHING_DATA,
    ERROR_NO_USERS_FOUND,
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
