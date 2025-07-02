from database import db

class InventoryItem(db.Model):
    """Junction table: represents a single item-quantity pair in a user's inventory"""
    __tablename__ = 'inventory_item'
    id = db.Column(db.Integer, primary_key=True)
    user_data_id = db.Column(db.Integer, db.ForeignKey('user_data.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    # Relationship to get item details
    item = db.relationship('Item', backref='inventory_entries')

    def to_dict(self):
        return {
            "id": self.id,
            "user_data_id": self.user_data_id,
            "item_id": self.item_id,
            "quantity": self.quantity,
            "item": self.item.to_dict() if self.item else None
        }
    
    @classmethod
    def process_json(cls, inventory_data, user_data_id):
        """
        Given a dictionary of inventory data and a parent user_data_id,
        either update an existing inventory item (if "id" exists) or create a new one.
        """
        if "id" in inventory_data:
            inv_item = cls.query.get(inventory_data["id"])
            if inv_item and inv_item.user_data_id == user_data_id:
                # Update existing inventory item
                inv_item.quantity = inventory_data.get("quantity", inv_item.quantity)
                inv_item.item_id = inventory_data.get("item_id", inv_item.item_id)
                return inv_item
        
        # Create new inventory item
        item_id = inventory_data.get("item_id")
        quantity = inventory_data.get("quantity", 1)
        
        new_inv_item = cls(
            user_data_id=user_data_id,
            item_id=item_id,
            quantity=quantity
        )
        db.session.add(new_inv_item)
        return new_inv_item
