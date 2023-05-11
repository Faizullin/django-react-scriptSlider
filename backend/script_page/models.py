from django.db import models
from script.models import Script

# Create your models here.

class ScriptPage(models.Model):
    title = models.CharField('Name',max_length=100)
    index = models.IntegerField("Index")
    script = models.ForeignKey(Script, related_name='script_pages', on_delete=models.CASCADE)
    content = models.TextField('Text')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def __unicode__(self):
        return 