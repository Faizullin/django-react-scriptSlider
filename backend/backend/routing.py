# backend/routing.py
from django.urls import path, include
from script.routing import websocket_urlpatterns as script_websocket_urlpatterns

websocket_urlpatterns = []
websocket_urlpatterns += script_websocket_urlpatterns