import json

import jwt
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import get_authorization_header, BaseAuthentication


class UserAuthenticationMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        request.user_token = self.authenticate(request)

        response = self.get_response(request)

        return response

    def get_jwt_value(self, request):
        auth = get_authorization_header(request).split()

        if len(auth) == 0:
            return None

        if auth[0] == b'Bearer':
            return auth[1]
        else:
            return None

    def authenticate(self, request):
        jwt_token = self.get_jwt_value(request)

        if jwt_token:
            return self.authenticate_credentials(jwt_token, request)
        else:
            return None

    def authenticate_credentials(self, token, request):

        try:
            token = payload_decode(token, request.application)
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed(('Signature invalid.'))

        return token


def payload_encode(payload):
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')


def payload_decode(payload, application):
    return jwt.decode(payload, settings.JWT_SECRET, algorithm=['HS256'],
                      issuer='uwapi-oauth-server', audience=application['sub'])
