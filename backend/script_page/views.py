from django.shortcuts import render
from .models import ScriptPage
from rest_framework import status, permissions,generics, filters
from .serializers import *
from rest_framework_simplejwt.authentication import  JWTAuthentication
from .permissions import IsOwnerAccessPermission




class ScriptPageListView(generics.ListAPIView):
    queryset = ScriptPage.objects.all()
    serializer_class = ScriptPageSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = super().get_queryset()
        data = self.request.query_params
        parent_script = data.get('script',None)
        page_index = data.get('index', None)
        if page_index and parent_script:
            qs = qs.filter(script_id = parent_script,index= page_index)
        elif page_index:
            qs = qs.filter(index = page_index)
        elif parent_script:
            qs = qs.filter(script_id = parent_script)
        return qs.filter(script__owner_id = self.request.user.pk)
    
class ScriptPageDetailView(generics.RetrieveAPIView):
    queryset = ScriptPage.objects.all()
    serializer_class = ScriptPageSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,IsOwnerAccessPermission)

class ScriptPageCreateView(generics.CreateAPIView):
    serializer_class = ScriptPageSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        data = self.request.data
        parent_script = data.script
        return serializer.save(script = parent_script)