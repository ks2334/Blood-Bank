from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .models import ChatData, Logs, CustomUser, Group
import json
import time


# Protocol
# US:To:Msg
# UR:from:Msg
# GS:groupName:Msg
# GR:groupName:senderName:Msg


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"] != AnonymousUser() and self.scope["user"].is_authenticated:
            self.user = self.scope["user"]
            self.user.channelName = self.channel_name
            print(self.user)
            self.user.save()
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        # Leave room group
        print(close_code)
        self.user.channelName = None
        self.user.save()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        try:
            print(message)
            msgType, receiver, msg = message.split(": ")
            print(msgType, receiver, msg)
            if msgType == "User":
                receiver = CustomUser.objects.get(phone=receiver)
                ChatData.objects.create(user1=self.scope["user"], isGroup=False, user2=receiver, message=msg)
                if receiver.channelName is not None:
                    await self.channel_layer.send(
                        receiver.channelName,
                        {
                            'type': 'chat_message',
                            'message': "UR: " + str(self.scope["user"].phone) + ": " + str(msg)
                        }
                    )

                if self.user.channelName is not None:
                    await self.channel_layer.send(
                        self.user.channelName,
                        {
                            'type': 'chat_message',
                            'message': "US: " + str(receiver.phone) + ": " + str(msg)
                        }
                    )
            elif msgType == "Group":
                group = Group.objects.get(title=receiver)
                ChatData.objects.create(user1=self.scope["user"], isGroup=True, group=group, message=msg)

                if self.user.channelName is not None:
                    await self.channel_layer.send(
                        self.user.channelName,
                        {
                            'type': 'chat_message',
                            'message': "GS: " + str(group.title) + ": " + str(msg)
                        }
                    )

                for i in CustomUser.objects.filter(group__id=group.id).exclude(channelName=None).exclude(phone=self.scope["user"].phone):
                    await self.channel_layer.send(
                        i.channelName,
                        {
                            'type': 'chat_message',
                            'message': "GR: " + str(group.title) + ": " + str(self.scope["user"].phone) + ": " + str(msg)
                        }
                    )

            else:
                if self.user.channelName is not None:
                    await self.channel_layer.send(
                        self.user.channelName,
                        {
                            'type': 'chat_message',
                            'message': "Invalid"
                        }
                    )
                print("Closing Websocket")
                await self.close()
            # receiver = CustomUser.objects.get(phone=receiver)
            # Send message to User

        except Exception as e:
            print(e)
            if self.user.channelName is not None:
                await self.channel_layer.send(
                    self.user.channelName,
                    {
                        'type': 'chat_message',
                        'message': "Invalid"
                    }
                )
            print("Closing Websocket")
            await self.close()

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))