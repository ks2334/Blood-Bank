import uuid
from datetime import datetime

from django.db import models
from django.contrib.auth.models import AbstractUser, Group


# Create your models here.

class CustomUser(AbstractUser):
    dob = models.DateField(null=True)
    bloodGroup = models.CharField(max_length=3)
    gender = models.BooleanField(default=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    phone = models.IntegerField(default=0, unique=True)
    username = models.CharField(max_length=20, unique=False, default="")
    profilePic = models.ImageField(upload_to="media/", blank=True, null=True)
    friends = models.ManyToManyField("self", blank=True)
    friendRequests = models.ManyToManyField("self", blank=True, symmetrical=False)
    education = models.CharField(max_length=30, unique=False, default="", editable=True,blank=True,null=True)
    profession = models.CharField(max_length=30, unique=False, default="", editable=True, null=True, blank=True)
    officeAddress = models.CharField(max_length=100, default="", editable=True, null=True, blank=True)
    pushToken = models.CharField(max_length=100, default="", blank=True)
    privilgeLevel = models.IntegerField(default=2)
    hasChatPrivilege = models.BooleanField(default=False)
    otp = models.CharField(null=True, max_length=6, blank=True)
    channelName = models.CharField(null=True, blank=True, max_length=50, default=None)
    donationDate = models.DateField(null=True, blank=True, auto_now=True)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['username', 'email']

    def __str__(self):
        return self.first_name + " " + self.last_name + " - " + str(self.phone)


class Group(models.Model):
    title = models.CharField(max_length=150)
    description = models.CharField(max_length=150)
    user = models.ManyToManyField(CustomUser, blank=True)
    image = models.ImageField(upload_to="media/", blank=True, null=True)
    pendingGroupRequest = models.ManyToManyField(CustomUser, related_name="user_content_type", blank=True)
    admin = models.ForeignKey(CustomUser, related_name="subadmin_user", on_delete=models.CASCADE, null=True)
    ishidden = models.BooleanField(default=False,editable=True)
    def __str__(self):
        return self.title


class GroupPost(models.Model):
    postDetails = models.CharField(max_length=300)
    time = models.DateTimeField(auto_now_add=True)
    group = models.ManyToManyField(Group)
    image = models.ImageField(upload_to="media/", blank=True, null=True)

    def __str__(self):
        self.string = ""
        for i in self.group.all():
            self.string = self.string + i.title + ","
        return self.string + " - " + self.postDetails


class ProfilePost(models.Model):
    postDetails = models.CharField(max_length=300)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="media/", blank=True, null=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return str(self.user) + " - " + self.postDetails


class FormPost(models.Model):
    postDetails = models.CharField(max_length=200, null=True)
    group = models.ManyToManyField(Group, blank=True)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.postDetails)


class FormData(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    time = models.CharField(max_length=300)
    post = models.ForeignKey(FormPost, blank=True, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.user)


class ChatData(models.Model):
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="User1")
    isGroup = models.BooleanField(default=False)
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name="User2")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True)
    message = models.CharField(max_length=5000)
    time = models.DateTimeField(auto_now_add=True)


class Logs(models.Model):
    log = models.CharField(max_length=300)
    time = models.DateTimeField(auto_now_add=True)


class WSTokens(models.Model):
    token = models.CharField(max_length=100, unique=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

