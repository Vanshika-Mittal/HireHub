from rest_framework import serializers
from .models import Job, JobApplication, Bid
from django.contrib.auth.models import User

class BidSerializer(serializers.ModelSerializer):
    freelancer = serializers.ReadOnlyField(source="freelancer.username")  # Show freelancer name

    class Meta:
        model = Bid
        fields = "__all__"

class JobSerializer(serializers.ModelSerializer):
    client_id = serializers.PrimaryKeyRelatedField(source="client", queryset=User.objects.all(), write_only=True)
    client = serializers.ReadOnlyField(source="client.username")  # Returns client username

    class Meta:
        model = Job
        fields = "__all__"

    def create(self, validated_data):
        skills = validated_data.pop("skills_required", [])
        validated_data["skills_required"] = skills if isinstance(skills, list) else []
        return Job.objects.create(**validated_data)

class JobApplicationSerializer(serializers.ModelSerializer):
    freelancer = serializers.ReadOnlyField(source="freelancer.username")

    class Meta:
        model = JobApplication
        fields = "__all__"

class BidSerializer(serializers.ModelSerializer):
    freelancer = serializers.ReadOnlyField(source="freelancer.username")

    class Meta:
        model = Bid
        fields = "__all__"
