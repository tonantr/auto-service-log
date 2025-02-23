from app.database.database import db
from app.models.service import Service


class Car(db.Model):
    __tablename__ = "cars"

    car_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    name = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    vin = db.Column(db.String(17), nullable=False)

    services = db.relationship("Service", backref="car", cascade="all, delete-orphan")

    def to_dict(self, include_services=False):
        car_dict = {
            "car_id": self.car_id,
            "user_id": self.user_id,
            "name": self.name,
            "model": self.model,
            "year": self.year,
            "vin": self.vin,
        }

        if include_services:
            car_dict["services"] = [service.to_dict() for service in self.services]

        return car_dict

    def __repr__(self):
        return str(self.to_dict())
