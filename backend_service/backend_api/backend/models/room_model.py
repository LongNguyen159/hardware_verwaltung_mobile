from django.db import models


class RoomModel(models.Model):
    id = models.AutoField(
        primary_key=True
    )

    room_number = models.TextField(
        max_length=100,
        null=False,
        blank=False
    )

    class Meta:
        db_table = 'Room'
