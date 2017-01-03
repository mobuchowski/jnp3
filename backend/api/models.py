from __future__ import unicode_literals

from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):
    friends = models.ManyToManyField('self', related_name='rev-friends', symmetrical=True)

    def __str__(self):
        return self.email


class Post(models.Model):
    author = models.ForeignKey(User, null=False)
    body = models.TextField()
