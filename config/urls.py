from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path,re_path
from django.views import defaults as default_views
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from rest_framework.authtoken.views import obtain_auth_token
from propylon_document_manager.file_versions.api.views import FileVersionViewSet
# API URLS
urlpatterns = [
    # API base url
    path("api/", include("config.api_router")),
    re_path(r'^documents/(?P<document_path>.+)$', FileVersionViewSet.as_view({'get': 'retrieve', 'post': 'create'}), name='file_version'),
    # DRF auth token
    path("api-auth/", include("rest_framework.urls")),
    path("auth-token/", obtain_auth_token),
    path('file_version/<str:hash_value>/', FileVersionViewSet.as_view({'get': 'retrieve_by_hash'}), name='file_version_by_hash'),
    path('file_version_latest/<str:hash_value>/', FileVersionViewSet.as_view({'get': 'retrieve_by_hash_version_numbers'}), name='retrieve_by_hash_version_numbers'),
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="api-schema"),
        name="api-docs",
    ),
    path("users/", include("propylon_document_manager.users.urls")),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
