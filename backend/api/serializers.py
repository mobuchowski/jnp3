from rest_framework import serializers

from api.models import Post, User


class UserSerializer(serializers.ModelSerializer):
    posts = serializers.HyperlinkedIdentityField('posts', view_name='userpost-list', lookup_field='username')

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'posts',)


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(required=False)

    class Meta:
        model = Post
        fields = ('id', 'author', 'body')