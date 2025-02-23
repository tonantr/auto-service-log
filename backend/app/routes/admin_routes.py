from flask import Blueprint, jsonify
from app.services.admin_service import AdminService

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/users", methods=["GET"])
def get_users():
    users = AdminService.get_all_users()
    return jsonify([user.to_dict() for user in users])