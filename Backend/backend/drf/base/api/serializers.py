from rest_framework import serializers
from .models import Goal, Step

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = [
            'id', 'goal', 'title', 'description', 'completed'
        ]

class GoalSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True, read_only=True)
    class Meta:
        model = Goal
        fields = [
        'id', 'steps', 'name'
        ]