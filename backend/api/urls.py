from django.conf.urls import url, include
from . import views


user_urls = [
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
    url(r'^posts/', include(post_urls)),
]
