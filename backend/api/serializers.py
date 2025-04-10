from rest_framework import serializers
from .models import Article, Comment, Bookmark
from django.contrib.auth import get_user_model
User = get_user_model()

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    is_owner = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at', 'is_owner']
        read_only_fields = ['id', 'author', 'created_at', 'is_owner']
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.author == request.user
        return False

class BookmarkSerializer(serializers.ModelSerializer):
    article_title = serializers.CharField(source='article.title', read_only=True)
    article_id = serializers.IntegerField(source='article.id', read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    
    class Meta:
        model = Bookmark
        fields = ['id', 'article', 'article_title', 'article_id', 'created_at']
        read_only_fields = ['id', 'created_at']

        
class UserProfileSerializer(serializers.ModelSerializer):
    bookmarks = BookmarkSerializer(many=True, read_only=True)
    join_date = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'join_date', 'bookmarks']
        read_only_fields = ['id', 'join_date']
    
    def get_join_date(self, obj):
        return obj.date_joined.strftime('%B %Y')