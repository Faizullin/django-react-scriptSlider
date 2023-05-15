from rest_framework import serializers
from .models import ScriptPage


class ScriptPageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ScriptPage
        fields = ['id','title','script','index','content','created_at','updated_at']
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    def get_created_at(self, obj):
        return obj.created_at.strftime('%d %B %Y')
    def get_updated_at(self, obj):
        return obj.updated_at.strftime('%d %B %Y')
