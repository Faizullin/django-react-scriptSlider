from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from .models import AuthKey
import jwt
import datetime

def get_and_update_authKey_token(user_id, script_id ,authKey = None):
    if authKey is None:
        authKey = AuthKey.objects.filter(owner_id = user_id, script_id=script_id).first()
    expiration_time = datetime.datetime.now() + datetime.timedelta(minutes=1)
    authKey_token = jwt.encode({
        'user_id': user_id,
        'script_id': script_id,
        'exp': expiration_time,
    }, settings.SECRET_KEY)
    if authKey:
        authKey.token = authKey_token
        authKey.save()
    else:
        authKey = AuthKey.objects.create(
            owner_id = user_id, script_id=script_id,
            token=authKey_token,
        )
    return authKey_token

class AuthKeyPermission(BasePermission):
    def has_permission(self, request, view):
        request.updated_apiKey_token = None
        request.script_id = None
        try:
            if 'Authkey' in request.headers:
                authKey_token = request.headers.get('Authkey')
                payload_decoded = jwt.decode(authKey_token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload_decoded.get('user_id')
                script_id = payload_decoded.get('script_id')
                request.script_id = script_id
        except jwt.ExpiredSignatureError:
            return False
        except jwt.InvalidTokenError:
            return False
        except Exception as err:
            return False
        try:
            authKey_obj = AuthKey.objects.get(owner_id = user_id,script_id = script_id)
            if authKey_obj.is_expired():
                if authKey_obj.updated_at + datetime.timedelta(days=1) > datetime.datetime.now(datetime.timezone.utc):
                    new_authKey_token = get_and_update_authKey_token(user_id=user_id,script_id=script_id, authKey=authKey_obj)
                    request.updated_apiKey_token = new_authKey_token
                    return True
                else:
                    return False
            else:
                return True
        except AuthKey.DoesNotExist:
            return False
        except Exception:
            return False
    
    def has_object_permission(self, request, view, obj):
        return obj.pk == request.script_id

class IsOwnerAccessPermission(BasePermission):
    message = 'Not allowed.'

    def has_object_permission(self, request, view, obj):
        # if request.method in permissions.SAFE_METHODS:
        #     return True
        return obj.owner == request.user