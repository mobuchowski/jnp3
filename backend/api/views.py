from django.shortcuts import render

# Create your views here.
from rest_framework import generics


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer = PostSerializer