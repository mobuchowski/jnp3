from rest_framework import permissions


class ViewPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return self.has_object_permission(request, view)

    def has_object_permission(self, request, view, obj=None):
        return request.method in permissions.SAFE_METHODS


class FriendViewPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj=None):
        return request.method in permissions.SAFE_METHODS and request.user in obj.author.friends and not request.user.is_anonymous


class AuthorPermission(FriendViewPermission):

    def has_object_permission(self, request, view, obj=None):
        if obj is None:
            can_edit = True
        else:
            can_edit = request.user == obj.author
        return can_edit or super(AuthorPermission, self).has_object_permission()