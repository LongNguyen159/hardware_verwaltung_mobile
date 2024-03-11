from django.db import models

from .product_type_model import ProductTypeModel
from .room_model import RoomModel
from .user_model import UserModel


class ItemModel(models.Model):
    id = models.AutoField(
        primary_key=True
    )

    product_type = models.ForeignKey(
        ProductTypeModel,
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )

    current_room = models.ForeignKey(
        RoomModel,
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )

    annotation = models.TextField(
        max_length=10000,
        null=True,
        blank=True
    )

    borrowed_by_user = models.ForeignKey(
        UserModel,
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )

    qr_code = models.TextField(
        max_length=10000,
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'Item'
