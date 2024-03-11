from .base_view import BaseCRUDAPIView
from ..serializers import ItemHistoryTypeSerializer
from ..models import ItemHistoryTypeModel


class ItemHistoryTypeView(BaseCRUDAPIView):
    queryset = ItemHistoryTypeModel.objects.all()
    serializer_class = ItemHistoryTypeSerializer
    lookup_fields = {'id': 'id', 'name': 'name'}