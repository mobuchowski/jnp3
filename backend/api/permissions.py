from rest_framework import permissions


class FriendViewOnlyPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        return self.has_object_permission(self, request, obj)

    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS and request.user in obj.author.friends



class PostAuthorEditPermission(FriendViewOnlyPermission):

    def has_object_permission(self, request, view, obj):
        if obj is None:
            can_edit = True
        else:
            can_edit = request.user == obj.author
        return can_edit or super(PostAuthorEditPermission, self).has_object_permission()