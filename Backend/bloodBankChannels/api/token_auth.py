from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from api.models import WSTokens
from django.shortcuts import get_object_or_404


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        headers = dict(scope['headers'])
        if b'sec-websocket-protocol' in headers:
            try:
                print(headers[b'sec-websocket-protocol'].decode())
                token_name, token_key = headers[b'sec-websocket-protocol'].decode().split(",")
                print(token_name,token_key)
                if token_name == 'Token':
                    token = get_object_or_404(WSTokens, token=token_key)
                    scope['user'] = token.user
                    close_old_connections()
            except Exception as e:
                scope['user'] = AnonymousUser()
        return self.inner(scope)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))