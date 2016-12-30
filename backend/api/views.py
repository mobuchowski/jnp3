from django.shortcuts import render

# Create your views here.
from rest_framework import generics

from api.models import Post


class PostList(generics.ListCreateAPIView):
    model = Post
    queryset = Post.objects.all()
    serializer = PostSerializer
    permission_classes = [
        permissions.AllowAny
    ]
