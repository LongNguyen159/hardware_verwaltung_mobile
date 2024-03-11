from .base_view import BaseCRUDAPIView
from ..serializers import UserTypeSerializer
from ..models import UserTypeModel


class UserTypeView(BaseCRUDAPIView):
    queryset = UserTypeModel.objects.all()
    serializer_class = UserTypeSerializer
    lookup_fields = {'id': 'id', 'name': 'name'}
