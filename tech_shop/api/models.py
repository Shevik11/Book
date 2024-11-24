# models.py
from django.db import models

class Book(models.Model):
    bookId = models.CharField(max_length=20, primary_key=True)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    rating = models.FloatField()
    description = models.TextField()
    pages = models.IntegerField()
    coverImg = models.URLField()

    class Meta:
        db_table = 'books_info'


from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Review(models.Model):
    book_id = models.CharField(max_length=100)  # Assuming book_id is a string
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


