from rest_framework import viewsets, permissions, status
from .models import Job, JobApplication, Bid
from .filters import JobFilter
from .serializers import JobSerializer, JobApplicationSerializer
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.response import Response
from rest_framework import status
from .serializers import BidSerializer
from django.db import transaction
from decimal import Decimal

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all().order_by("-bid_date")
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in freelancers can bid

    def perform_create(self, serializer):
        """Ensure only one bid is placed at a time and a freelancer can bid once per job."""
        job_id = self.request.data.get("job")
        freelancer = self.request.user
        bid_amount = self.request.data.get("bid_amount")

        try:
            bid_amount = Decimal(bid_amount)
        except (TypeError, ValueError):
            return Response({"error": "Invalid bid amount."}, status=status.HTTP_400_BAD_REQUEST)


        with transaction.atomic():  # Prevent simultaneous bidding
            job = Job.objects.select_for_update().get(id=job_id)
            
            # Get the highest existing bid for the job
            highest_bid = Bid.objects.filter(job=job).order_by("-bid_amount").first()
            
            if Bid.objects.filter(job=job, freelancer=freelancer).exists():
                raise ValueError("You have already placed a bid for this job.")
                # return Response({"error": "You have already placed a bid for this job."}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save(freelancer=freelancer)

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