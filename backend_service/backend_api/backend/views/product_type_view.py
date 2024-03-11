from .base_view import BaseCRUDAPIView
from ..serializers import ProductTypeSerializer
from ..models import ProductTypeModel


class ProductTypeView(BaseCRUDAPIView):
    queryset = ProductTypeModel.objects.all()
    serializer_class = ProductTypeSerializer
    lookup_fields = {'id': 'id', 'name': 'name', 'description': 'description'}
