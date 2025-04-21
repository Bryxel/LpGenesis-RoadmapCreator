from django.db import models

# Create your models here.

class Goal(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
  
class Step(models.Model):
    goal = models.ForeignKey(Goal, related_name='steps', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    completed = models.BooleanField(default=False)\
    
    def __str__(self):
        return self.title
    
    