from .base_view import BaseCRUDAPIView
from ..serializers import RoomSerializer
from ..models import RoomModel


class RoomView(BaseCRUDAPIView):
    queryset = RoomModel.objects.all()
    serializer_class = RoomSerializer
    lookup_fields = {'id': 'id', 'room_number': 'room_number'}
