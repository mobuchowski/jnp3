from django.conf.urls import url, include
from . import views
from rest_framework.authtoken.views import obtain_auth_token


user_urls = [
    url(r'^create/', views.Register.as_view(), name='user-create'),
    url(r'^current/friends/', views.CurrentUserFriendList.as_view(), name='current-user-friends'),
    url(r'^current/posts/', views.CurrentUserPostList.as_view(), name='current-user-posts'),
    url(r'^current/', views.CurrentUserDetail.as_view(), name='current-user-detail'),
    url(r'^(?P<username>[0-9a-zA-Z_-]+)/friends/$', views.UserFriendList.as_view(), name='user-friends'),
    url(r'^(?P<username>[0-9a-zA-Z_-]+)/posts/$', views.UserPostList.as_view(), name='userpost-list'),
    url(r'^(?P<username>[0-9a-zA-Z_-]+)/$', views.UserDetail.as_view(), name='user-detail'),
    url(r'^$', views.UserList.as_view(), name='user-list')
]

post_urls = [
    url(r'^(?P<pk>\d+)/$', views.PostDetail.as_view(), name='post-detail'),
    url(r'^$', views.PostList.as_view(), name='post-list')
]

urlpatterns = [
    url(r'^users/', include(user_urls)),
    url(r'^wallPosts/$', views.WallPosts.as_view(), name="wall-posts"),
    url(r'^posts/', include(post_urls)),
    url(r'^token/auth/', obtain_auth_token),
]
