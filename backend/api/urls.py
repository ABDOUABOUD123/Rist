from django.urls import path
from .views import (
    ArticleListCreateView,
    ArticleDetailView,
    CommentListCreateView,
    CommentDetailView,
    BookmarkListView,
    BookmarkCreateDeleteView,
    UserProfileView
)

urlpatterns = [
    path('articles/', ArticleListCreateView.as_view(), name='article-list'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('articles/<int:article_id>/comments/', CommentListCreateView.as_view(), name='article-comment-list'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    path('user/bookmarks/', BookmarkListView.as_view(), name='bookmark-list'),
    path('articles/<int:article_id>/bookmark/', BookmarkCreateDeleteView.as_view(), name='article-bookmark'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
]