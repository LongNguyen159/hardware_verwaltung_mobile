from rest_framework import serializers

from ..models import ProductTypeModel


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTypeModel
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']
