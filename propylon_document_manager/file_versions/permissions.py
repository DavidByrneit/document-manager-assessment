from rest_framework.permissions import BasePermission

class HasAccessToFileVersion(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Write permission is only allowed to the owner of the file version.
        if request.method in ['PUT', 'PATCH', 'DELETE','POST']:
            return obj.user == request.user
        # Read permission is allowed to any user.
        elif request.method in ['GET']:
            return True
        else:
            return False