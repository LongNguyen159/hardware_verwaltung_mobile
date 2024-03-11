from rest_framework import serializers

from .item_serializer import ItemSerializer
from .user_serializer import UserSerializer
from .item_history_type_serializer import ItemHistoryTypeSerializer
from .room_serializer import RoomSerializer
from ..models import ItemHistoryModel


class ItemHistorySerializer(serializers.ModelSerializer):
    item = ItemSerializer()
    user = UserSerializer()
    item_history_type = ItemHistoryTypeSerializer()
    room = RoomSerializer()

    class Meta:
        model = ItemHistoryModel
        fields = ['id', 'item', 'user', 'item_history_type', 'room', 'date']
        read_only_fields = ['id']