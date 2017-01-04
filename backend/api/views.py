from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status

from api.serializers import PostSerializer, UserSerializer
from api.models import Post, User
from api.permissions import AuthorPermission, ViewPermission
from rest_framework.response import Response
from rest_framework.views import APIView


class Register(APIView):
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request):
        serialized = UserSerializer(data=request.data, context={'request': request})
        if serialized.is_valid():
            User.objects.create_user(
                username=serialized.initial_data['username'],
                password=serialized.initial_data['password'],
                email=serialized.initial_data['email'],
            )
            return Response(serialized.initial_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


class PostList(generics.ListCreateAPIView):
    model = Post
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        AuthorPermission,
    ]


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Post
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        AuthorPermission,
    ]


class UserPostList(generics.ListAPIView):
    model = Post
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        AuthorPermission,
    ]

    def get_queryset(self):
        queryset = super(UserPostList, self).get_queryset()
        return queryset.filter(author__username=self.kwargs.get('username'))


class UserList(generics.ListCreateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        AuthorPermission,
    ]


class UserDetail(generics.RetrieveAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    permission_classes = [
        ViewPermission,
    ]

