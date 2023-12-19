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
class FileVersionViewSet(CreateModelMixin,RetrieveModelMixin, ListModelMixin, GenericViewSet):
    authentication_classes = []
    permission_classes = []
    serializer_class = FileVersionSerializer
    queryset = FileVersion.objects.all()
    lookup_field = "id"

    

    def create(self, request, *args, **kwargs):
        document_path = unquote(kwargs.get('document_path'))
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

            file_version = FileVersion(file_name=file, version_number=version_number, file=file, url=document_path)
            file_version.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def retrieve(self, request, *args, **kwargs):
        document_path = unquote(kwargs.get('document_path'))
        revision = request.GET.get('revision')

        if revision is not None:
            # If a revision number is provided, get that specific version
            try:
                file_version = FileVersion.objects.get(url=document_path, version_number=revision)
            except FileVersion.DoesNotExist:
                raise Http404("File not found")
        else:
            # If no revision number is provided, get the latest version
            file_version = FileVersion.objects.filter(url=document_path).order_by('-version_number').first()

        if file_version is None:
            raise Http404("File not found")

        # Serialize the file_version object
        serializer = self.get_serializer(file_version)

        return Response(serializer.data)