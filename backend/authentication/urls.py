from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views

app_name = 'authentication'

urlpatterns = [
      path('api/register/', views.RegisterView.as_view(), name='register'),
      path('api/token/', 
            jwt_views.TokenObtainPairView.as_view(), 
            name ='token_obtain_pair'),
      path('api/token/refresh/', 
            jwt_views.TokenRefreshView.as_view(), 
            name ='token_refresh'),
      path('api/user/', views.AuthProfileView.as_view(), name='user'),
]