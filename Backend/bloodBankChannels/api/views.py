import json
import random
import urllib.parse
import urllib.request
from collections import namedtuple
from datetime import timedelta
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.utils.safestring import mark_safe
# Expo Notifications
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
from rest_framework import generics, status
from rest_framework.generics import UpdateAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# Create your views here.

def send_push_message(token, message, extra=None):
    response = PushClient().publish(
        PushMessage(to=token,
                    body=message,
                    data=extra))

def index(request):
    if request.user.is_authenticated and request.user.privilgeLevel == 1:
        return redirect("/admin-panel")
    return render(request, 'login.html')


class UserUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserRegisterSerializer

    def get_queryset(self):
        return CustomUser.objects.all()


class Register(APIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer

    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Profile(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(phone=self.request.user.phone)


class Groups(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        GroupTuple = namedtuple("Groups", ('yourGroups', 'otherGroups'))

        yourGroups = request.user.group_set.all()
        otherGroups = Group.objects.filter(ishidden=False).exclude(user=request.user)
        group = GroupTuple(yourGroups=yourGroups, otherGroups=otherGroups)
        serializer = GroupViewSerializer(group)
        return Response(serializer.data, status=status.HTTP_200_OK)


#####
class Friend(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializerWithoutFriends

    def post(self, request, *args, **kwargs):
        phone = request.data["phone"]
        u = CustomUser.objects.get(phone=phone)
        u.friendRequests.add(request.user)
        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):
        return self.request.user.friends.all()


class FriendRequest(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializerWithoutFriends

    def post(self, request, *args, **kwargs):
        phone = request.data["phone"]
        u = CustomUser.objects.get(phone=phone)

        if request.user.friendRequests.filter(phone=u.phone).exists():
            request.user.friendRequests.remove(u)
            request.user.friends.add(u)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.request.user.friendRequests.all()


class FeedView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        Feed = namedtuple("Feed", ('groupPosts', 'profilePosts', 'formPosts'))
        groups = request.user.group_set.all()
        friends = request.user.friends.all()
        groupPostList = set()
        profilePostList = []
        formPostList = set()

        for g in groups:
            for i in g.grouppost_set.all().order_by('-id')[:3]:
                groupPostList.add(i)

            for j in g.formpost_set.all().order_by('-id')[:3]:
                formPostList.add(j)
        profilePostList += request.user.profilepost_set.all().order_by('-id')[:2]
        for f in friends:
            profilePostList += f.profilepost_set.all().order_by('-id')[:4]

        # groupPostList = list(groupPostList)
        # formPostList = list(formPostList)
        # profilePostList.reverse()
        # groupPostList.reverse()
        # formPostList.reverse()
        feed = Feed(groupPosts=groupPostList, profilePosts=profilePostList, formPosts=formPostList)
        serializer = FeedSerializer(feed)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetGroupPosts(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        Posts = namedtuple("Feed", ('groupPosts', 'formPosts'))
        g = Group.objects.get(pk=pk)
        gp = g.grouppost_set.all().order_by("-id")
        fp = g.formpost_set.all().order_by("-id")

        groupPosts = Posts(groupPosts=gp, formPosts=fp)
        serializer = GroupPageSerializer(groupPosts)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        ProfileTuple = namedtuple("Profile", ('requests', 'profilePosts'))

        posts = request.user.profilepost_set.all().order_by('-id')

        friends = request.user.friends.all() | CustomUser.objects.filter(
            phone=request.user.phone) | request.user.friendRequests.all()
        s = request.user.friendRequests.all()
        profile = ProfileTuple(requests=s[:5], profilePosts=posts)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PostProfile(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfilePostSerializer

    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        p = ProfilePost.objects.create(user=request.user, postDetails=request.data["postDetails"])
        try:
            p.image = request.data["image"]
        except():
            p.image = None
        p.save()
        return Response(status=status.HTTP_201_CREATED)


class FriendListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        FriendTuple = namedtuple("Friend", ('friends', 'friendRequests'))

        friend = FriendTuple(friendRequests=request.user.friendRequests.all(), friends=request.user.friends.all())
        serializer = ProfileSerializer(friend)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LikePost(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        id = request.data["id"]
        p = ProfilePost.objects.get(pk=id)
        p.likes = p.likes + 1
        p.save()
        return Response(status=status.HTTP_200_OK)


class JoinGroup(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        group = Group.objects.get(pk=request.data["group"])
        user = request.user
        group.pendingGroupRequest.add(user)
        group.save()
        return Response(status=status.HTTP_200_OK)


class SetNotificationToken(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        try:
            token = request.data["token"]
            user.pushToken = token
            user.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class Search(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, query):
        res = CustomUser.objects.filter(first_name__startswith=query) or CustomUser.objects.filter(
            last_name__startswith=query)
        serializer = UserSerializer(res, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchAll(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        res = CustomUser.objects.exclude(id=request.user.id)
        serializer = UserSerializer(res, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Admin

class AddGroupPost(APIView):
    queryset = GroupPost.objects.all()
    serializer_class = GroupPostSerializerAdmin

    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        serializer = GroupPostSerializerAdmin(data=request.data)
        if serializer.is_valid():
            serializer.save()
            channel_layer = get_channel_layer()
            data = dict(request.data)

            image = "/media/media/" +str(data["image"][0]).replace(" ","_")
            print(image)
            for i in data["group"]:
                group = Group.objects.get(id=i)
                for j in CustomUser.objects.filter(group__id=i):
                    if j.channelName is not None:
                        if(image=="/media/media/"):
                            async_to_sync(channel_layer.send)(
                                j.channelName,
                                {
                                    'type': 'chat_message',
                                    'message': "GR: " + str(group.title) + ": Admin" + ": " + str(
                                        data["postDetails"][0])
                                }
                            )
                        else:
                            async_to_sync(channel_layer.send)(
                                j.channelName,
                                {
                                    'type': 'chat_message',
                                    'message': "GR: " + str(group.title) + ": Admin" + ": " + str(
                                        data["postDetails"][0]) + ": Image: " + image
                                }
                            )
                    if j.pushToken is not None and j.pushToken != "":
                        try:
                            send_push_message(j.pushToken, "You Have New Messages in Group: " + str(group.title))
                        except:
                            print("Unable to send notification")

            return adminPanel(request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateGroup(APIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializerAdmin

    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return redirect("../admin-panel")
        return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupUpdateView(UpdateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializerAdmin


class createFormPost(APIView):
    queryset = FormPost.objects.all()
    serializer_class = FormPostSerializer

    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        serializer = FormPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            requests = []
            groups = Group.objects.filter(admin=request.user.id)
            posts = FormPost.objects.all()
            for group in groups:
                requests += group.pendingGroupRequest.all()

            channel_layer = get_channel_layer()
            data = dict(request.data)
            for i in data["group"]:
                group = Group.objects.get(id=i)
                for j in CustomUser.objects.filter(group__id=i):
                    if j.channelName is not None:
                        print(group.admin.phone)
                        async_to_sync(channel_layer.send)(
                            j.channelName,
                            {
                                'type': 'chat_message',
                                'message': "GR: " + str(group.title) + ": Admin" + ": " + str(
                                    data["postDetails"][0]) + ": Form: " + str(FormPost.objects.last().id)
                            }
                        )
                    if j.pushToken is not None and j.pushToken != "":
                        try:
                            print(j)
                            send_push_message(j.pushToken, "You Have New Messages in Group: " + str(group.title))
                        except:
                            print("Unable to send notification")

            return render(request, 'admin-panel.html', {'requests': requests, 'groups': groups, 'posts': posts})
        return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class getFormResponse(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FormDataSerializer

    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        p = FormData.objects.create(user=request.user, time=request.data["time"])
        p.post = FormPost.objects.get(pk=request.data["id"])
        p.save()
        return Response(status=status.HTTP_201_CREATED)


class GetFormPosts(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        g = Group.objects.get(pk=pk)
        gp = g.formpost_set.all()
        serializer = FormPostSerializer(gp, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class getFriendPosts(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        p = CustomUser.objects.get(pk=pk)
        posts = p.profilepost_set.all()

        serializer = ProfilePostFriendSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


def logged(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                if user.privilgeLevel == 1:
                    return redirect("../admin-panel/")
                elif user.privilgeLevel == 0 and user.is_superuser:
                    # Super Admin Panel
                    return redirect("../admin/")
                else:
                    return HttpResponse("<h1>Not Authorized to access!</h1>")
        else:
            return redirect('/')
    else:
        return redirect('/')


def adminPanel(request):
    if request.user.is_authenticated:
        requests = []
        groups = Group.objects.filter(admin=request.user)
        posts = []
        for group in groups:
            posts += FormPost.objects.filter(group=group)
        for group in groups:
            requests += group.pendingGroupRequest.all()

        return render(request, 'admin-panel.html',
                      {'requests': requests, 'groups': groups, 'posts': posts, 'msg': "Post Created Successfully !"})

    else:
        return redirect("/")


def acceptGroupRequest(request, userid, groupid):
    user = CustomUser.objects.get(id=userid)
    group = Group.objects.get(id=groupid)
    group.pendingGroupRequest.remove(user)
    group.user.add(user)
    requests = []
    groups = Group.objects.filter(admin=request.user)
    posts = []
    for group in groups:
        posts += FormPost.objects.filter(group=group)
    for group in groups:
        requests += group.pendingGroupRequest.all()
    return render(request, 'admin-panel.html', {'requests': requests, 'groups': groups, 'posts': posts})


def removeUser(request, userid, groupid):
    user = CustomUser.objects.get(id=userid)
    group = Group.objects.get(id=groupid)
    group.pendingGroupRequest.remove(user)
    requests = []
    groups = Group.objects.filter(admin=request.user)
    posts = []
    for group in groups:
        posts += FormPost.objects.filter(group=group)
    for group in groups:
        requests += group.pendingGroupRequest.all()
    return render(request, 'admin-panel.html', {'requests': requests, 'groups': groups, 'posts': posts})


def logoutAdmin(request):
    if request.user.is_authenticated:
        logout(request)
        return redirect("../")


# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.
def send_push_message(token, message, extra=None):
    response = PushClient().publish(
        PushMessage(to=token,
                    body=message,
                    data=extra))


def sendSMS(apikey, numbers, sender, message):
    data = urllib.parse.urlencode({'apikey': apikey, 'numbers': numbers,
                                   'message': message, 'sender': sender})
    data = data.encode('utf-8')
    request = urllib.request.Request("https://api.textlocal.in/send/?")
    f = urllib.request.urlopen(request, data)
    fr = f.read()
    return (fr)


# resp = sendSMS("DEr70itGrxI-glogKbbyS6pVu7oAoH8qAojixjpNkQ","9527997632","Kunal","Hello World")
# print(resp)


def chatIndex(request):
    return render(request, 'chat.html', {})


def chatRoom(request, room_name):
    return render(request, 'chatRoom.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })


def forgotPassword(request):
    return render(request, 'reset_password.html')


def resetPassword(request):
    phone = request.POST['phone']
    if CustomUser.objects.filter(phone=phone).exists():
        user = CustomUser.objects.filter(phone=phone).first()
        user.otp = random.randint(100000, 999999)
        user.save()
        resp = sendSMS("DEr70itGrxI-ik05lJzaFlxONNzyD5uYTHYKWzwWUW", user.phone, "TXTLCL",
                       "your otp is : " + str(user.otp))
        return render(request, 'password_confirm.html',
                      {"a": "Password reset otp has been sent on your phone ...", "phone": user.phone})
    return render(request, 'reset_password.html', {"msg": "This user is not on our records ..."})


def setPassword(request):
    pass1 = request.POST['password1']
    pass2 = request.POST['password2']
    otp = request.POST['otp']
    phone = request.POST['phone']
    user = CustomUser.objects.filter(phone=phone).first()
    if pass1 == pass2 and len(user.otp) == 6 and user.otp == otp:
        user.set_password(pass1)
        user.save()
        return HttpResponse("your password has been changed successfully !")
    return render(request, 'password_confirm.html', {"a": "something went wrong ..."})


def resetDonate(request, id):
    user = CustomUser.objects.get(id=id)
    user.donationDate = datetime.today() + timedelta(3 * 30)
    user.save()
    return JsonResponse({}, status=status.HTTP_200_OK)


class GetChatDataView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        Posts = namedtuple("ChatData",
                           ('imageData', 'formData', 'textData', 'availableGroups', 'userGroups', 'wsToken'))
        g = request.user.group_set.all()
        imageData = GroupPost.objects.none()
        formData = FormPost.objects.none()
        textData = ChatData.objects.none()

        for cnt, i in enumerate(g):
            gp = GroupPost.objects.filter(group=i.pk)
            fp = FormPost.objects.filter(group=i.pk)
            tp = ChatData.objects.filter(group=i.pk, isGroup=True)
            if cnt == 0:
                imageData = gp
                formData = fp
                textData = tp
            else:
                if gp is not None:
                    imageData = imageData | gp
                if fp is not None:
                    formData = formData | fp
                if tp is not None:
                    textData = textData | tp

        tp = ChatData.objects.filter(user1=request.user, isGroup=False)
        if tp is not None:
            textData = textData | tp
        tp = ChatData.objects.filter(user2=request.user, isGroup=False)
        if tp is not None:
            textData = textData | tp

        token = get_random_string(length=50)

        while True:
            flag = True
            for i in WSTokens.objects.all():
                if i.token == token:
                    token = get_random_string(length=50)
                    flag = False
                    break
            if flag:
                break

        try:
            w = WSTokens.objects.get(user=request.user)
            w.token = token
            w.save()
        except Exception as e:
            w = WSTokens.objects.create(user=request.user, token=token)

        chatPosts = Posts(imageData=imageData.distinct(), formData=formData.distinct(), textData=textData.distinct(),
                          availableGroups=Group.objects.filter(ishidden=False).exclude(user=request.user),
                          userGroups=request.user.group_set.all(),
                          wsToken=w)
        serializer = GetChatDataSerializer(chatPosts)
        return Response(serializer.data, status=status.HTTP_200_OK)


class getWSToken(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        token = get_random_string(length=50)
        w = WSTokens.objects.filter(user=request.user)
        if w is not None:
            w.delete()
        while True:
            try:
                w = WSTokens.objects.create(user=request.user, token=token)
                break
            except Exception as e:
                token = get_random_string(length=50)

        serializer = WSTokenSerializer(w, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


def giveBroadcastView(request):
    groups = Group.objects.filter(admin=request.user)
    return render(request, "broadcast.html", {'groups': groups})


def sendBroadcastView(request):
    title = request.POST['title']
    text = request.POST['textbody']
    groupsid = request.POST.getlist('groupsend')
    groupsid = list(map(int, groupsid))
    groupslist = Group.objects.filter(admin=request.user)
    groups = []
    users =[]
    for i in groupsid:
        groups += Group.objects.filter(id=i)
    for g in groups:
        users += g.user.all()
    users = list(set(users))
    for user in users:
        resp = sendSMS("7/E+qrsb/mk-VfKW5dQQBz6thbwQwiUt21rNUMnwKl", user.phone, "TXTLCL",
                       title + " " + text)
        print(resp)
        pass
    return render(request, "broadcast.html", {'groups': groupslist})
