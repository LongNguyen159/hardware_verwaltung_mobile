from django.urls import path

from . import views

api_pattern = "api/v1/"

urlpatterns = [
  # User
  path(f'{api_pattern}user/', views.UserView.as_view(), name='user-list'),
  path(f'{api_pattern}user/<str:lookup_field>/<str:lookup_value>/', views.UserView.as_view(), name='user-lookup'),

  # UserType
  path(f'{api_pattern}user-type/', views.UserTypeView.as_view(), name='user-type-list'),
  path(f'{api_pattern}user-type/<str:lookup_field>/<str:lookup_value>/', views.UserTypeView.as_view(), name='user-type-lookup'),

  # Room
  path(f'{api_pattern}room/', views.RoomView.as_view(), name='room-list'),
  path(f'{api_pattern}room/<str:lookup_field>/<str:lookup_value>/', views.RoomView.as_view(), name='room-lookup'),

  # ProductType
  path(f'{api_pattern}product-type/', views.ProductTypeView.as_view(), name='product-type-list'),
  path(f'{api_pattern}product-type/<str:lookup_field>/<str:lookup_value>/', views.ProductTypeView.as_view(), name='product-type-lookup'),

  # Item
  path(f'{api_pattern}item/', views.ItemView.as_view(), name='item-list'),
  path(f'{api_pattern}item/<str:lookup_field>/<str:lookup_value>/', views.ItemView.as_view(), name='item-lookup'),

  # ItemHistory
  path(f'{api_pattern}item-history/', views.ItemHistoryView.as_view(), name='item-history-list'),
  path(f'{api_pattern}item-history/<str:lookup_field>/<str:lookup_value>/', views.ItemHistoryView.as_view(), name='item-history-lookup'),

  # ItemHistoryType
  path(f'{api_pattern}item-history-type/', views.ItemHistoryTypeView.as_view(), name='item-history-type-list'),
  path(f'{api_pattern}item-history-type/<str:lookup_field>/<str:lookup_value>/', views.ItemHistoryTypeView.as_view(), name='item-history-type-lookup'),
]
