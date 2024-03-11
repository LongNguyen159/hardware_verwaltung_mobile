from rest_framework import serializers

from ..models import UserTypeModel


class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTypeModel
        fields = ['id', 'name']
        read_only_fields = ['id']
