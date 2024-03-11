from django.db import models

from .user_type_model import UserTypeModel


class UserModel(models.Model):
    id = models.AutoField(
        primary_key=True
    )

    first_name = models.TextField(
        max_length=100,
        null=False,
        blank=False
    )

    last_name = models.TextField(
        max_length=100,
        null=False,
        blank=False
    )

    email = models.TextField(
        max_length=100,
        null=False,
        blank=False
    )

    user_type = models.ForeignKey(
        UserTypeModel,
        on_delete=models.CASCADE
    )

    password_hash = models.TextField(
        max_length=100,
        null=False,
        blank=False
    )

    class Meta:
        db_table = 'User'

