from __future__ import unicode_literals

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings

import architect
from django.views.decorators.cache import cache_page


# Create your models here.

class User(AbstractUser):
    friends = models.ManyToManyField('self', blank=True, related_name='rev-friends', symmetrical=True)

    def __str__(self):
        return self.username + ' ' + self.email

@architect.install('partition', type='range', subtype='date', constraint='month', column='created_at')
class Post(models.Model):
    author = models.ForeignKey(User, null=False)
    body = models.TextField()
    created_at = created_at = models.DateTimeField(auto_now_add=True)

    @cache_page(60)
    def dispatch(self, *args, **kwargs):
        return super(Post, self).dispatch(*args, **kwargs)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
