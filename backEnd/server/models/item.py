from database import db

class Item(db.Model):
    """Master catalog of all possible items"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))  # 'food', 'toy', 'decoration', etc.
    description = db.Column(db.Text)
    price = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price
        }
