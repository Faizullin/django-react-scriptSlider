from django.urls import path
from . import views

app_name = 'script_page'

urlpatterns = [
    path("api/script_page/", views.ScriptPageListView.as_view(), name="index"),
    path("api/script_page/<int:pk>/", views.ScriptPageDetailView.as_view(), name="detail"),
    path("api/script_page/create/", views.ScriptPageCreateView.as_view(), name="create"),
]
