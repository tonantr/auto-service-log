from app.database.database import db


class Service(db.Model):
    __tablename__ = "services"

    service_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    car_id = db.Column(
        db.Integer, db.ForeignKey("cars.car_id", ondelete="CASCADE"), nullable=False
    )
    mileage = db.Column(db.Integer, nullable=False)
    service_type = db.Column(db.Text, nullable=False)
    service_date = db.Column(db.Date, nullable=False)
    next_service_date = db.Column(db.Date, nullable=True)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    notes = db.Column(db.Text, nullable=True)

    car = db.relationship('Car', back_populates='services')

    def to_dict(self):
        return {
            "service_id": self.service_id,
            "car_id": self.car_id,
            "mileage": self.mileage,
            "service_type": self.service_type,
            "service_date": (
                self.service_date.isoformat() if self.service_date else None
            ),
            "next_service_date": (
                self.next_service_date.isoformat() if self.next_service_date else None
            ),
            "cost": float(self.cost),
            "notes": self.notes,
        }

    def __repr__(self):
        return str(self.to_dict())
