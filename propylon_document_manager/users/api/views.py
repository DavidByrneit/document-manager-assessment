from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin,CreateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
User = get_user_model()


class UserViewSet(CreateModelMixin,RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "pk"
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email', None)
        if User.objects.filter(email=email).exists():
            raise ValidationError("A user with this email already exists.")
        password = serializer.validated_data.get('password', None)
        if password is not None:
            try:
                validate_password(password)
            except ValidationError as e:
                return Response({"password": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        user=self.perform_create(serializer)
        user.set_password(password)  # Hash the password
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        user = serializer.save()
        return user
        
    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)
