import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIRequestFactory, force_authenticate
from .models import FileVersion
from .api.views import FileVersionViewSet
from django.urls import reverse

@pytest.mark.django_db
def test_create_file_version(user):  # user fixture is used here
    # Create a file
    file = SimpleUploadedFile("file.txt", b"file_content")

    # Create a request
    factory = APIRequestFactory()
    document_path = '/test'
    url = reverse('file_version', kwargs={'document_path': document_path})
    request = factory.post(url, {'file': file}, format='multipart')

    # Authenticate the request
    force_authenticate(request, user=user)

    # Create a viewset
    viewset = FileVersionViewSet.as_view({'post': 'create'})

    # Call the viewset with the request
    response = viewset(request, document_path=document_path)

    # Check that the response status code is 201
    assert response.status_code == 201

    # Check that a FileVersion object was created
    assert FileVersion.objects.count() == 1

    # Check that the FileVersion object has the correct attributes
    file_version = FileVersion.objects.first()
    if file_version is not None:
        assert file_version.user == user
        assert file_version.file_name == 'file.txt'
        assert file_version.version_number == 1
        assert file_version.url == '/test'
    else:
        pytest.fail("No FileVersion object was created")


    # Create another file
    file2 = SimpleUploadedFile("file2.txt", b"file_content2")

    # Create another request
    request2 = factory.post(url, {'file': file2}, format='multipart')

    # Authenticate the request
    force_authenticate(request2, user=user)

    # Call the viewset with the second request
    response2 = viewset(request2, document_path=document_path)

    # Check that the response status code is 201
    assert response2.status_code == 201

    # Check that another FileVersion object was created
    assert FileVersion.objects.count() == 2

    # Check that the latest FileVersion object has the correct attributes
    file_version2 = FileVersion.objects.latest('id')
    if file_version is not None:
        assert file_version2.user == user
        assert file_version2.file_name == 'file2.txt'
        assert file_version2.version_number == 2
        assert file_version2.url == '/test'
    else:
        pytest.fail("No latest FileVersion object was found")


@pytest.mark.django_db
def test_retrieve_file_version(user):  # user fixture is used here
    # Create a file version
    file1 = SimpleUploadedFile("file1.txt", b"file_content1")
    file2 = SimpleUploadedFile("file2.txt", b"file_content2")
    FileVersion.objects.create(file=file1,url='/test', version_number=1, user=user)
    FileVersion.objects.create(file=file2,url='/test', version_number=2, user=user)

    # Create a request factory
    factory = APIRequestFactory()

    # Create a GET request to retrieve the latest file version
    retrieve_url = reverse('file_version', kwargs={'document_path': '/test'})
    retrieve_request = factory.get(retrieve_url)

    # Authenticate the retrieve request
    force_authenticate(retrieve_request, user=user)

    # Call the viewset with the retrieve request
    retrieve_viewset = FileVersionViewSet.as_view({'get': 'retrieve'})
    retrieve_response = retrieve_viewset(retrieve_request, document_path='/test')

    # Check that the response status code is 200
    assert retrieve_response.status_code == 200

    # Check that the retrieved file version is the latest one
    assert retrieve_response.data['version_number'] == 2

    # Create a GET request to retrieve a specific file version
    retrieve_request_specific = factory.get(retrieve_url, {'revision': 1})

    # Authenticate the retrieve request
    force_authenticate(retrieve_request_specific, user=user)

    # Call the viewset with the retrieve request
    retrieve_response_specific = retrieve_viewset(retrieve_request_specific, document_path='/test')

    # Check that the response status code is 200
    assert retrieve_response_specific.status_code == 200

    # Check that the retrieved file version is the specific one
    assert retrieve_response_specific.data['version_number'] == 1

@pytest.mark.django_db
def test_retrieve_by_hash(user):  # user fixture is used here
    # Create a file version
    file = SimpleUploadedFile("file.txt", b"file_content")
    file_version = FileVersion.objects.create(file=file, url='/test', version_number=1, user=user)
    print(file_version.hash_value)
    # Create a request factory
    factory = APIRequestFactory()

    # Create a GET request to retrieve the file version by hash
    retrieve_url = reverse('file_version_by_hash', kwargs={'hash_value': file_version.hash_value})
    retrieve_request = factory.get(retrieve_url)

    # Authenticate the retrieve request
    force_authenticate(retrieve_request, user=user)

    # Call the viewset with the retrieve request
    retrieve_viewset = FileVersionViewSet.as_view({'get': 'retrieve_by_hash'})
    retrieve_response = retrieve_viewset(retrieve_request, hash_value=file_version.hash_value)

    # Check that the response status code is 200
    assert retrieve_response.status_code == 200

    # Check that the retrieved file version is the correct one
    assert retrieve_response.data['hash_value'] == file_version.hash_value
    assert retrieve_response.data['version_number'] == 1

@pytest.mark.django_db
def test_retrieve_by_hash_version_numbers(user):  # user fixture is used here
    # Create a file version
    file = SimpleUploadedFile("file.txt", b"file_content")
    file_version = FileVersion.objects.create(file=file, url='/test', version_number=1, user=user)

    # Create a second file version with the same url and user but different version number
    file2 = SimpleUploadedFile("file2.txt", b"file_content2")
    file_version2 = FileVersion.objects.create(file=file2, url='/test', version_number=2, user=user)

    # Create a request factory
    factory = APIRequestFactory()

    # Create a GET request to retrieve the file version by hash
    retrieve_url = reverse('file_version_by_hash_version_numbers', kwargs={'hash_value': file_version2.hash_value})
    retrieve_request = factory.get(retrieve_url)

    # Authenticate the retrieve request
    force_authenticate(retrieve_request, user=user)

    # Call the viewset with the retrieve request
    retrieve_viewset = FileVersionViewSet.as_view({'get': 'retrieve_by_hash_version_numbers'})
    retrieve_response = retrieve_viewset(retrieve_request, hash_value=file_version2.hash_value)

    # Check that the response status code is 200
    assert retrieve_response.status_code == 200

    # Check that the retrieved file version is the latest one with the same url and user
    assert retrieve_response.data['hash_value'] == file_version2.hash_value
    assert retrieve_response.data['version_number'] == 2