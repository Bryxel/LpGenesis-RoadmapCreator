from rest_framework import viewsets
from .models import Goal, Step
from .serializers import GoalSerializer, StepSerializer

# Create your views here.

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    
    
class StepViewSet(viewsets.ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer