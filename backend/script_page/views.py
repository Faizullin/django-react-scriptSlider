from django.shortcuts import render
from .models import ScriptPage
from rest_framework import status, permissions,generics, filters
from .serializers import *
from rest_framework_simplejwt.authentication import  JWTAuthentication
import logging



class ScriptPageListView(generics.ListAPIView):
    queryset = ScriptPage.objects.all()
    serializer_class = ScriptPageSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = super().get_queryset()
        logger = logging.getLogger(__name__)
        logger.info("WebSocket connection established,"+str(self.request.GET))
        data = self.request.GET
        parent_script = data.get('script',None)
        page_index = data.get('index', None)
        if page_index and parent_script:
            return qs.filter(script__in = parent_script,index__in = page_index)
        elif page_index:
            return qs.filter(index__in = page_index)
        elif parent_script:
            return qs.filter(script__in = parent_script)
        return qs
class ScriptPageDetailView(generics.RetrieveAPIView):
    queryset = ScriptPage.objects.all()
    serializer_class = ScriptPageSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

class ScriptPageCreateView(generics.CreateAPIView):
    serializer_class = ScriptPageSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        data = self.request.data
        parent_script = data.script
        return serializer.save(script = parent_script)