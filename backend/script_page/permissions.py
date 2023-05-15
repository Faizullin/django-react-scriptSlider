from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication

class IsOwnerAccessPermission(BasePermission):
    message = 'Not allowed.'

    def has_object_permission(self, request, view, obj):
        return obj.script.owner == request.user