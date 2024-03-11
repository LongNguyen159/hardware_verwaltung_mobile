from django.db import models


class ItemHistoryTypeModel(models.Model):
    id = models.AutoField(
        primary_key=True
    )

    name = models.TextField(
        max_length=100,
        null=False,
        blank=False
    )

    class Meta:
        db_table = 'ItemHistoryType'
