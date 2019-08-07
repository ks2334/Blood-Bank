from rest_framework import serializers
from .models import *


class FriendFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'email', 'dob', 'address', 'bloodGroup', 'gender',
                  'phone', 'username', 'profilePic', 'friends', 'friendRequests', 'education', 'profession',
                   'officeAddress', 'donationDate')


class UserSerializer(serializers.ModelSerializer):
    friends = FriendFieldSerializer(many=True, read_only=True)
    friendRequests = FriendFieldSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'email', 'dob', 'address', 'bloodGroup', 'gender',
                  'phone', 'profilePic', 'friends', 'friendRequests', 'education', 'profession',
                   'officeAddress',
                  'pushToken', 'hasChatPrivilege', 'donationDate')
        extra_kwargs = {'profilePic': {'required': False},
                        'friends': {'required': False},
                        'friendRequests': {'required': False},
                        'pushToken': {'required': False},
                        'donationDate': {'required': False},
                        'hasChatPrivilege': {'required': False},
                        }


class UserSerializerWithoutFriends(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'email', 'dob', 'address', 'bloodGroup', 'gender',
                  'phone', 'profilePic', 'education', 'profession',
                  'officeAddress',
                  'pushToken', 'hasChatPrivilege', 'donationDate')
        extra_kwargs = {'profilePic': {'required': False},
                        'friends': {'required': False},
                        'friendRequests': {'required': False},
                        'pushToken': {'required': False},
                        'donationDate': {'required': False},
                        'hasChatPrivilege': {'required': False},
                        }



class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'email', 'dob', 'address', 'bloodGroup', 'gender',
                  'phone', 'profilePic', 'education', 'profession',
<<<<<<< HEAD
                  'emergencyContact', 'officeAddress','pushToken','password')
=======
                 'officeAddress')
>>>>>>> 000fbdeea102181bbe5f140c39a9554347741aaf
        extra_kwargs = {'profilePic': {'required': False},
                        'email': {'required': False},
                        'dob': {'required': False},
                        'address': {'required': False},
                        'education': {'required': False},
                        'profession': {'required': False},
<<<<<<< HEAD
                        'emergencyContact': {'required': False},
                        'officeAddress': {'required': False},
                        'pushToken': {'required': False},}
=======

                        'officeAddress': {'required': False}, }
>>>>>>> 000fbdeea102181bbe5f140c39a9554347741aaf

    def create(self, validated_data):
        user = CustomUser(
            email=validated_data['email'],
            dob=validated_data['dob'],
            address=validated_data['address'],
            bloodGroup=validated_data['bloodGroup'],
            gender=validated_data['gender'],
            phone=validated_data['phone'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['phone'],
            education=validated_data['education'],
            profession=validated_data['profession'],
            officeAddress=validated_data['officeAddress'],
            pushToken=validated_data['pushToken']
        )
        try:
            user.profilePic = validated_data['profilePic']
        except:
            user.profilePic = None
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        print(validated_data)
        instance.email = validated_data.get('email', instance.email)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.address = validated_data.get('address', instance.address)
        instance.bloodGroup = validated_data.get('bloodGroup', instance.bloodGroup)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('phone', instance.username)
        instance.education = validated_data.get('education', instance.education)
        instance.profession = validated_data.get('profession', instance.profession)
        instance.officeAddress = validated_data.get('officeAddress', instance.officeAddress)
        instance.profilePic = validated_data.get('profilePic', instance.profilePic)
        instance.save()
        return instance


class GroupSerializer(serializers.ModelSerializer):
    user = UserSerializerWithoutFriends(many=True, read_only=True)

    class Meta:
        model = Group
        fields = (
            'id', 'title', 'description', 'user', 'image', 'admin'
        )


class ProfilePostSerializer(serializers.ModelSerializer):
    user = UserSerializerWithoutFriends(many=False, read_only=True)

    class Meta:
        model = ProfilePost
        fields = (
            'id', 'postDetails', 'time', 'user', 'image', 'likes'
        )


class ProfilePostFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePost
        fields = (
            'id', 'postDetails', 'time', 'image', 'likes'
        )


class GroupPostSerializer(serializers.ModelSerializer):
    group = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = GroupPost
        fields = (
            'id', 'postDetails', 'time', 'group', 'image'
        )


class GroupPostSerializerAdmin(serializers.ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(many=True, queryset=Group.objects.all())

    class Meta:
        model = GroupPost
        fields = (
            'id', 'postDetails', 'time', 'group', 'image'
        )
        extra_kwargs = {
            'group': {'required': True}
        }

        def create(self, validated_data):
            post = GroupPost(
                postDetails=validated_data['postDetails'],
                time=validated_data['time'],
                group=validated_data['group'],
                image=validated_data['image']
            )
            post.save()
            return post


class GroupSerializerAdmin(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.all())

    class Meta:
        model = Group
        fields = (
            'id', 'title', 'description', 'image', 'user'
        )

    def create(self, validated_data):
        group = Group(
            title=validated_data['title'],
            description=validated_data['description'],
            image=validated_data['image'],
        )
        group.save()
        return group

    def update(self, instance, validated_data):
        print(validated_data)
        instance.id = validated_data.get('id', instance.id)
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance


class FormPostSerializer(serializers.ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(many=True, queryset=Group.objects.all())

    class Meta:
        model = FormPost
        fields = (
            'id', 'postDetails', 'time', 'group'
        )


class FormDataSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.all())
    post = serializers.PrimaryKeyRelatedField(many=True, queryset=FormPost.objects.all())

    class Meta:
        model = FormData
        fields = (
            'id', 'time', 'user', 'post'
        )

    def create(self, validated_data):
        data = FormData(
            time=validated_data['time'],
        )
        data.save()
        return data


class GroupPageSerializer(serializers.Serializer):
    groupPosts = GroupPostSerializer(many=True)
    formPosts = FormPostSerializer(many=True)


class FeedSerializer(serializers.Serializer):
    groupPosts = GroupPostSerializer(many=True)
    profilePosts = ProfilePostSerializer(many=True)
    formPosts = FormPostSerializer(many=True)


class ProfileSerializer(serializers.Serializer):
    requests = UserSerializerWithoutFriends(many=True)
    profilePosts = ProfilePostSerializer(many=True)


class GroupViewSerializer(serializers.Serializer):
    yourGroups = GroupSerializer(many=True)
    otherGroups = GroupSerializer(many=True)


class FriendListViewSerializer(serializers.Serializer):
    friends = UserSerializer(many=True)
    friendRequests = UserSerializer(many=True)


class WSTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = WSTokens
        fields = "__all__"


class UserChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'bloodGroup', 'gender',
                  'phone', 'profilePic')
        extra_kwargs = {'profilePic': {'required': False}}


class GroupChatSerializer(serializers.ModelSerializer):
    user = UserChatSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = (
            'id', 'title', 'description', 'user', 'image', 'admin'
        )


class GroupChatAvailableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = (
            'id', 'title', 'description', 'image'
        )


class GroupChatSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            'title'
        ]


class GroupPostChatSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField(many=True)

    class Meta:
        model = GroupPost
        fields = (
            'id', 'postDetails', 'time', 'group', 'image'
        )


class FormPostChatSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField(many=True)

    class Meta:
        model = FormPost
        fields = (
            'id', 'postDetails', 'time', 'group'
        )


class ChatDataSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField(many=False, allow_null=True)
    user1 = UserChatSerializer(many=False, read_only=True)
    user2 = UserChatSerializer(many=False, allow_null=True, read_only=True)

    class Meta:
        model = ChatData
        fields = (
            'id', 'user1', 'isGroup', 'user2', 'group', 'message', 'time'
        )


class GetChatDataSerializer(serializers.Serializer):
    wsToken = WSTokenSerializer(many=False)
    availableGroups = GroupChatAvailableSerializer(many=True)
    userGroups = GroupChatSerializer(many=True)
    imageData = GroupPostChatSerializer(many=True)
    formData = FormPostChatSerializer(many=True)
    textData = ChatDataSerializer(many=True)
