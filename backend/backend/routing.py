# script/routing.py
from django.urls import re_path, path

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from script import consumers

websocket_urlpatterns = [
    #re_path(r"ws/script/(?P<room_name>\w+)/$", consumers.ScriptConsumer.as_asgi()),
    path('ws/script/<str:room_name>/', consumers.ScriptConsumer.as_asgi(), name='script_scroll'),
]

# application = ProtocolTypeRouter(
#     {
#         # (http->django views is added by default)
#         # "websocket": TokenAuthMiddleware(
#         #     URLRouter(yourapp.routing.websocket_urlpatterns)
#         # )
#         "websocket": URLRouter([
#             websocket_urlpatterns
#         ]),
#     }
# )
# application = ProtocolTypeRouter({
#     'websocket': AuthMiddlewareStack(
#         URLRouter(
#             websocket_urlpatterns
#         )
#     ),
# })