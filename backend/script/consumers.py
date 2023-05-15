import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from .models import AuthKey

class ScriptConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connect')
        if self.scope["user"] is AnonymousUser:
            await self.close()
            return
        await self.accept()
        self.user = self.scope["user"]
        self.script_room = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.script_room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        

    @database_sync_to_async
    def delete_authKey_object(self):
        try:
            obj = AuthKey.objects.filter(owner_id=self.user.pk, script_id = self.script_room)
            obj.delete()
            return True
        except AuthKey.DoesNotExist:
            return False
        
    async def disconnect(self, close_code):
        await self.delete_authKey_object()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'script_message',
                'message': message
            }
        )

    # Receive message from room group
    async def script_message(self, event, type='script_message'):
        message = event['message']
        print("send",message)
        await self.send(text_data=json.dumps({
            'message': message
        }))