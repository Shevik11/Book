from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookFilter
from .views import ReviewViewSet

router = DefaultRouter()
router.register(r'books', BookFilter, basename='book')
router.register(r'reviews', ReviewViewSet, basename='review')


urlpatterns = [
    path('', include(router.urls)),  # No circular reference here
]