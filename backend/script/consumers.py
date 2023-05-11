import asyncio
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .models import AuthKey
from jwt import encode as jwt_encode
import datetime

class ScriptConsumer(AsyncWebsocketConsumer):
    async def connect(self):       
        if self.scope["user"] is AnonymousUser:
            await self.close()
            return
        self.script_room = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.script_room
        
        # self.initAuthKey()
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        
        await self.accept()

    def initAuthKey(self):
        authKey = AuthKey.objects.filter(owner = self.scope["user"], script=self.script_room).first()
        expiration_time = datetime.utcnow() + datetime.timedelta(days=1)
        authKey_token = jwt_encode({
            'user_id': self.scope["user"].id,
            'script_id': self.script_room,
            'room_group_name': self.room_group_name,
            'exp': expiration_time,
        })
        if authKey:
            authKey.token = authKey_token
            authKey.save()
        else:
            authKey = AuthKey.objects.create(
                owner = self.scope["user"], script=self.script_room,
                token=authKey_token,
            )

    async def disconnect(self, close_code):
        # Leave room group
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
        print('send',message)
        await self.send(text_data=json.dumps({
            'message': message
        }))