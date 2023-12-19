# Import necessary modules from Django and Django Rest Framework
from django.http import Http404
from django.shortcuts import render
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin,CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from rest_framework.response import Response
from django.core.files import File
from urllib.parse import unquote
from file_versions.models import FileVersion
from .serializers import FileVersionSerializer
from django.db.models import Max

# Define a viewset for FileVersion model
class FileVersionViewSet(CreateModelMixin,RetrieveModelMixin, ListModelMixin, GenericViewSet):
    # Set authentication and permission classes to empty - no authentication or permissions required
    authentication_classes = []
    permission_classes = []
    # Set the serializer class to FileVersionSerializer
    serializer_class = FileVersionSerializer
    # Set the queryset to all FileVersion objects
    queryset = FileVersion.objects.all()
    # Set the lookup field to "id"
    lookup_field = "id"

    # Define the create method
    def create(self, request, *args, **kwargs):
        # Get the document path from the request
        document_path = unquote(kwargs.get('document_path'))
        # Get the file from the request
        file = request.FILES.get('file')
        if file:
            # Check if a file with the same URL already exists
            existing_files = FileVersion.objects.filter(url=document_path)
            if existing_files.exists():
                # If it does, increment the version number by 1
                max_version = existing_files.aggregate(Max('version_number'))['version_number__max']
                version_number = max_version + 1
            else:
                # If it doesn't, start with version number 1
                version_number = 1

            # Create a new FileVersion object with the provided file and version number
            file_version = FileVersion(file_name=file, version_number=version_number, file=file, url=document_path)
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
                file_version = FileVersion.objects.get(url=document_path, version_number=revision)
            except FileVersion.DoesNotExist:
                # If the requested version does not exist, raise a 404 error
                raise Http404("File not found")
        else:
            # If no revision number is provided, get the latest version
            file_version = FileVersion.objects.filter(url=document_path).order_by('-version_number').first()

        if file_version is None:
            # If no file version was found, raise a 404 error
            raise Http404("File not found")

        # Serialize the file_version object
        serializer = self.get_serializer(file_version)

        # Return the serialized data
        return Response(serializer.data)