from .base_view import BaseCRUDAPIView
from ..serializers import ItemHistorySerializer
from ..models import ItemHistoryModel


class ItemHistoryView(BaseCRUDAPIView):
    queryset = ItemHistoryModel.objects.all()
    serializer_class = ItemHistorySerializer
    lookup_fields = {'id': 'id', 'item': 'item', 'user': 'user', 'item_history_type': 'item_history_type', 'room': 'room', 'date': 'date'}
