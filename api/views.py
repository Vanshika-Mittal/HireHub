from rest_framework import viewsets, permissions
from .models import Job, JobApplication
from .filters import JobFilter
from .serializers import JobSerializer, JobApplicationSerializer
from django_filters.rest_framework import DjangoFilterBackend

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by("-created_at")
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend]
    filterset_class = JobFilter

    def get_queryset(self):
        """Allow filtering jobs based on skills_required query parameter."""
        queryset = Job.objects.all()
        skills = self.request.query_params.get('skills_required')
        if skills:
            skill_list = skills.split(",")  # Convert to list
            queryset = queryset.filter(skills_required__overlap=skill_list)  # Match any skill
        return queryset

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)  # Assign employer automatically

    def update(self, request, *args, **kwargs):
        """Allow only the job creator to update the job."""
        job = self.get_object()
        if job.client != request.user:
            return Response({"error": "You are not allowed to edit this job."}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Allow only the job creator to delete the job."""
        job = self.get_object()
        if job.client != request.user:
            return Response({"error": "You are not allowed to delete this job."}, status=403)
        return super().destroy(request, *args, **kwargs)

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by("-submitted_at")
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)  # Assign freelancer automatically