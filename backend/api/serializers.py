from rest_framework import serializers

from api.models import Post


class UserSerializer(serializers.ModelSerializer):



class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'author', 'body')