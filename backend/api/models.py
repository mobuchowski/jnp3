from __future__ import unicode_literals

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings


# Create your models here.


class User(AbstractUser):
    friends = models.ManyToManyField('self', blank=True, related_name='rev-friends', symmetrical=True)

    def __str__(self):
        return self.username + ' ' + self.email


class Post(models.Model):
    author = models.ForeignKey(User, null=False)
    body = models.TextField()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
