# Import necessary modules from Django and Django Rest Framework
from django.http import Http404
from django.shortcuts import render
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin,CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from rest_framework.response import Response
from django.core.files import File
from urllib.parse import unquote
from django.core.files.storage import default_storage
from propylon_document_manager.file_versions.permissions import HasAccessToFileVersion
from ..models import FileVersion
from .serializers import FileVersionSerializer
from django.db.models import Max
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.http import FileResponse
# Define a viewset for FileVersion model
class FileVersionViewSet(CreateModelMixin,RetrieveModelMixin, ListModelMixin, GenericViewSet):
    # Set authentication and permission classes to empty - no authentication or permissions required
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated,HasAccessToFileVersion]
    # Set the serializer class to FileVersionSerializer
    serializer_class = FileVersionSerializer
    # Set the queryset to all FileVersion objects
    queryset = FileVersion.objects.all()
    # Set the lookup field to "id"
    lookup_field = "id"
    
    # Override the get_queryset method
    def get_queryset(self):
        # Return only the FileVersion objects that belong to the current user
        return FileVersion.objects.filter(user=self.request.user)

    

    def create(self, request, *args, **kwargs):
        # Get the document path from the request
        document_path = unquote(kwargs.get('document_path'))
        # Get the file from the request
        file = request.FILES.get('file')
        if file:
            # Check if a file with the same URL already exists for the current user
            existing_files_same_user = FileVersion.objects.filter(url=document_path, user=request.user)
            # Check if a file with the same URL exists for other users
            existing_files_other_users = FileVersion.objects.filter(url=document_path).exclude(user=request.user)
            if existing_files_other_users.exists():
                # If a file with the same URL exists for other users, return an error
                raise ValidationError('The URL has been taken already.')
            elif existing_files_same_user.exists():
                # If a file with the same URL exists for the current user, increment the version number by 1
                max_version = existing_files_same_user.aggregate(Max('version_number'))['version_number__max']
                version_number = max_version + 1
            else:
                # If no file with the same URL exists, start with version number 1
                version_number = 1

            # Create a new FileVersion object with the provided file, version number, and user
            file_version = FileVersion(file_name=file, version_number=version_number, file=file, url=document_path, user=request.user)
            # Save the new FileVersion object
            file_version.save()
            # Return a 201 CREATED response
            return Response(status=status.HTTP_201_CREATED)
        else:
            # If no file was provided, return a 400 BAD REQUEST response
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    # Define the retrieve method
    def retrieve(self, request, *args, **kwargs):
        # Get the document path from the request
        document_path = unquote(kwargs.get('document_path'))
        # Get the revision number from the request
        revision = request.GET.get('revision')

        if revision is not None:
            # If a revision number is provided, get that specific version
            try:
                file_version = FileVersion.objects.get(url=document_path, version_number=revision, user=request.user)
            except FileVersion.DoesNotExist:
                # If the requested version does not exist, raise a 404 error
                raise Http404("File not found")
        else:
            # If no revision number is provided, get the latest version
            file_version = FileVersion.objects.filter(url=document_path,user=request.user).order_by('-version_number').first()

        if file_version is None:
            # If no file version was found, raise a 404 error
            raise Http404("File not found")

        # Serialize the file_version object
        serializer = self.get_serializer(file_version)

        # Return the serialized data
        return Response(serializer.data)
    
    def retrieve_by_hash(self, request, hash_value, *args, **kwargs):
        try:
            # Use the hash value to retrieve the corresponding FileVersion object
            file_version = FileVersion.objects.get(hash_value=hash_value)
        except FileVersion.DoesNotExist:
            # If no FileVersion object with the given hash value exists, raise a 404 error
            raise Http404("File not found")
        
        # Open the file and read its content
        file_path = file_version.file.path
       
        return FileResponse(open(file_path, 'rb'))
    
    def retrieve_by_hash_version_numbers(self, request, hash_value, *args, **kwargs):
        try:
            # Use the hash value to retrieve the corresponding FileVersion object
            file_version = FileVersion.objects.get(hash_value=hash_value)
            file_version_latest = FileVersion.objects.filter(url=file_version.url,user=request.user).order_by('-version_number').first()
        except FileVersion.DoesNotExist:
            # If no FileVersion object with the given hash value exists, raise a 404 error
            raise Http404("File not found")
        
       # Serialize the file_version object
        serializer = self.get_serializer(file_version_latest)
       
        return Response(serializer.data)