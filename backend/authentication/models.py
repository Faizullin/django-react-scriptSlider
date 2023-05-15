from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.core.mail import send_mail  
from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(
            # instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            'http://localhost:3000/auth/password_reset/confirm/',
            reset_password_token.key),
        'site_name': "ScriptSliderApp"
    }
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = "{}?token={}".format(
        context['reset_password_url'],
        reset_password_token.key)
    msg = EmailMultiAlternatives(
        "Password Reset for {title}".format(title="Some website title"),
        email_plaintext_message,
        "noreply@somehost.local",
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
    
class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    email = models.EmailField(_("email address"), unique=True, blank=True)