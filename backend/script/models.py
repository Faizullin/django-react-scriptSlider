from django.db import models
from authentication.models import User
from datetime import timedelta, timezone, datetime

# Create your models here.

EXPIRE_INTERVAL = 1 # minutes
class Script(models.Model):
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def __unicode__(self):
        return 

class AuthKey(models.Model):
    token = models.CharField('Token',max_length=100)
    script = models.ForeignKey(Script, related_name='auth_key', on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_expired(self):
        expiry_time = self.updated_at + timedelta(minutes=EXPIRE_INTERVAL)
        return datetime.now(timezone.utc) > expiry_time

    def __str__(self):
        return f'{self.owner.username}(#{self.owner.id}) - {self.script.title}(#{self.script.id})'

    def __unicode__(self):
        return 
