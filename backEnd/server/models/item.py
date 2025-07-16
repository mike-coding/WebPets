from database import db

class Item(db.Model):
    """Master catalog of all possible items"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))  # 'food', 'toy', 'decoration', etc.
    description = db.Column(db.Text)
    price = db.Column(db.Integer, default=0)
    hunger_restore = db.Column(db.Float, default=0) #e.g. restore 15% hunger, 5%, etc
    happiness_boost = db.Column(db.Float, default=0) # 5%, 2.5%, 10%, whateva
    health_effect = db.Column(db.String(100)) # heal illness, make ill chance? etc
    dimension_x = db.Column(db.Integer, default=0)
    dimension_y = db.Column(db.Integer, default=0)
    held_effect = db.Column(db.String(100), default='')  # Effect when held, e.g. 'glow', 'sparkle', etc.
    size_modifier = db.Column(db.String(1), default='M')  # 'S', 'M', 'L'
    can_store = db.Column(db.Boolean, default=True)  # Can this item be stored in inventory?
    sprite_id = db.Column(db.Integer, nullable=True)  # ID of the sprite in the sprite sheet


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price,
            "hunger_restore": self.hunger_restore,
            "happiness_boost": self.happiness_boost,
            "health_effect": self.health_effect,
            "dimension_x": self.dimension_x,
            "dimension_y": self.dimension_y,
            "held_effect": self.held_effect
        }
