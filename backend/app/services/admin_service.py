from app.models.user import User

class AdminService:
    @staticmethod
    def get_all_users():
        return User.query.all()