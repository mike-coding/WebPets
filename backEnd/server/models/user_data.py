from database import db

class UserData(db.Model):
    __tablename__ = 'user_data'
    # Use the same primary key as the User id
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    completed_tutorial = db.Column(db.Boolean, default=False)
    money = db.Column(db.Integer, default=0)
    pets = db.relationship('Pet', backref='user_data', lazy=True)
    home_objects = db.relationship('HomeObject', backref='user_data', lazy=True)
    inventory = db.relationship('InventoryItem', backref='user_data', lazy=True)

    def to_dict(self):
        return {
            "completed_tutorial": self.completed_tutorial,
            "money": self.money,
            "pets": [pet.to_dict() for pet in self.pets],
            "home_objects": [obj.to_dict() for obj in self.home_objects],
            "inventory": [inv.to_dict() for inv in self.inventory]
        }
