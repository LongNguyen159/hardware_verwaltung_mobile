from rest_framework import serializers

from ..models import ItemModel
from .product_type_serializer import ProductTypeSerializer
from .room_serializer import RoomSerializer
from .user_serializer import UserSerializer


class ItemSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer()
    current_room = RoomSerializer()
    borrowed_by_user = UserSerializer()

    class Meta:
        model = ItemModel
        fields = ['id', 'product_type', 'current_room', 'annotation', 'borrowed_by_user', 'qr_code']
        read_only_fields = ['id']
