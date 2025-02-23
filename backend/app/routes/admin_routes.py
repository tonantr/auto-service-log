from flask import Blueprint, jsonify, request
from models import User

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])