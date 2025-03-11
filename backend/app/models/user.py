from app.database.database import db


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    role = db.Column(db.Enum("admin", "user", name="role_enum"), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    cars = db.relationship('Car', back_populates='user', cascade="all, delete-orphan")
    login_logs = db.relationship('LoginLogs', back_populates='user', cascade="all, delete-orphan")

    def to_dict(self, include_cars=False):
        user_dict = {
            "user_id": self.user_id,
            "username": self.username,
            "role": self.role,
            "email": self.email,
        }

        if include_cars:
            user_dict["cars"] = [car.to_dict() for car in self.cars]

        return user_dict

    def __repr__(self):
        return str(self.to_dict())
