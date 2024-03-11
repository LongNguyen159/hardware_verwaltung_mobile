from django.db import models

from .item_model import ItemModel
from .user_model import UserModel
from .item_history_type_model import ItemHistoryTypeModel
from .room_model import RoomModel


class ItemHistoryModel(models.Model):
    id = models.AutoField(
        primary_key=True
    )

    item = models.ForeignKey(
        ItemModel,
        null=False,
        blank=False,
        on_delete=models.CASCADE
    )

    user = models.ForeignKey(
        UserModel,
        null=False,
        blank=False,
        on_delete=models.CASCADE
    )

    item_history_type = models.ForeignKey(
        ItemHistoryTypeModel,
        null=False,
        blank=False,
        on_delete=models.CASCADE
    )

    room = models.ForeignKey(
        RoomModel,
        null=False,
        blank=False,
        on_delete=models.CASCADE
    )

    date = models.DateTimeField(
        auto_now_add=True,
        null=False,
        blank=False
    )

    class Meta:
        db_table = 'ItemHistory'
