from api.views import UserDetail
from django.shortcuts import render


def login(request):
    return render(request, 'login.html', {})


def wall(request):
    return render(request, 'wall.html', {})
