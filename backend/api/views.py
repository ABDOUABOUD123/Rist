from .models import Article, Comment, Bookmark
from .serializers import ArticleSerializer, CommentSerializer, BookmarkSerializer, UserProfileSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
User = get_user_model()

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        article_id = self.kwargs['article_id']
        return Comment.objects.filter(article_id=article_id).order_by('-created_at')
    
    def perform_create(self, serializer):
        article_id = self.kwargs['article_id']
        serializer.save(article_id=article_id, author=self.request.user)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Comment.objects.filter(author=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(author=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Comment was deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )

class BookmarkListView(generics.ListAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).select_related('article')

class BookmarkCreateDeleteView(generics.CreateAPIView, generics.DestroyAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)
    
    def get_object(self):
        try:
            return Bookmark.objects.get(
                user=self.request.user,
                article_id=self.kwargs['article_id']
            )
        except Bookmark.DoesNotExist:
            return None
    
    def get(self, request, *args, **kwargs):
        bookmark = self.get_object()
        return Response(
            {'exists': bookmark is not None},
            status=status.HTTP_200_OK
        )
    
    def create(self, request, *args, **kwargs):
        article_id = kwargs['article_id']
        if self.get_object():
            raise ValidationError({"detail": "Article already bookmarked"})
        
        try:
            article = Article.objects.get(id=article_id)
            bookmark = Bookmark.objects.create(user=request.user, article=article)
            serializer = self.get_serializer(bookmark)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Article.DoesNotExist:
            return Response(
                {"detail": "Article not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def delete(self, request, *args, **kwargs):
        bookmark = self.get_object()
        if not bookmark:
            return Response(
                {"detail": "Bookmark not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        bookmark.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        user = self.request.user
        # Prefetch bookmarks to optimize queries
        user.bookmarks = Bookmark.objects.filter(user=user).select_related('article')
        return user