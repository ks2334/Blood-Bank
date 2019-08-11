from django.contrib import admin
from api.models import *
# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Group)
admin.site.register(GroupPost)
admin.site.register(ProfilePost)
admin.site.register(FormData)
admin.site.register(FormPost)
admin.site.register(WSTokens)
admin.site.register(ChatData)
admin.site.register(Logs)
