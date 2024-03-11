from rest_framework import serializers

from ..models import ItemHistoryTypeModel


class ItemHistoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemHistoryTypeModel
        fields = ['id', 'name']
        read_only_fields = ['id']
