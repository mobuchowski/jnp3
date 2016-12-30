from django.conf.urls import url, include

from api.views import PostList

urlpatterns = [
    url(r'^$', PostList.as_view(), name='post-list')
]