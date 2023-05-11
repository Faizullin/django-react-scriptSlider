from django.urls import path
from . import views

app_name = 'script'

urlpatterns = [
    path("api/script/", views.ScriptListView.as_view(), name="index"),
    path("api/script/create/", views.ScriptCreateView.as_view(), name="create"),
    path("api/script/<int:pk>/", views.ScriptDetailView.as_view(), name="detail"),
    path("api/script/<int:pk>/edit", views.ScriptEditView.as_view(), name="edit"),
    path("api/script/<int:pk>/delete/", views.ScriptDeleteView.as_view(), name="delete"),
    path("api/script/<int:pk>/track_url/", views.ScriptScrollTrackUrlView.as_view(), name="get_track_url"),
    path("api/script/<int:pk>/presentaion/scroll/", views.ScriptPresentaionScrollView.as_view(), name="presentation_scroll"),
]
