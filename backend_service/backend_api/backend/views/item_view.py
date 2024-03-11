from .base_view import BaseCRUDAPIView
from ..serializers import ItemSerializer
from ..models import ItemModel


class ItemView(BaseCRUDAPIView):
    queryset = ItemModel.objects.all()
    serializer_class = ItemSerializer
    lookup_fields = {'id': 'id', 'product_type': 'product_type', 'current_room': 'current_room', 'annotation': 'annotation', 'borrowed_by_user': 'borrowed_by_user', 'qr_code': 'qr_code'}
