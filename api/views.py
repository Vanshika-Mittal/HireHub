from rest_framework import viewsets, permissions, status
from .models import Job, JobApplication, Bid
from .filters import JobFilter
from .serializers import JobSerializer, JobApplicationSerializer
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .serializers import BidSerializer
from django.db import transaction
from decimal import Decimal
from django.contrib.auth.models import User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    role = request.data.get("role")  # custom user field if needed

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    # optionally store role in a custom user profile model
    return Response({"message": "User created"}, status=201)

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

    @action(detail=True, methods=["get", "post"], url_path="select-freelancer")
    def select_freelancer(self, request, pk=None):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=404)
        # job = self.get_object()

        if job.client != request.user:
            return Response({"error": "Only the client can access or select a freelancer for this job."}, status=status.HTTP_403_FORBIDDEN)

        # === GET request: Show all bids for this job ===
        if request.method == 'GET':
            bids = Bid.objects.filter(job=job).order_by('-bid_date')
            serializer = BidSerializer(bids, many=True)
            return Response(serializer.data)

        # === POST request: Select a freelancer ===
        # freelancer_id = request.data.get("freelancer_id")
        # if not freelancer_id:
        #     return Response({"error": "Freelancer ID required."}, status=status.HTTP_400_BAD_REQUEST)

        # if job.status != "open":
        #     return Response({"error": "Freelancer already selected or job not open."}, status=status.HTTP_400_BAD_REQUEST)

        # try:
        #     with transaction.atomic():
        #         selected_app = JobApplication.objects.get(job=job, freelancer_id=freelancer_id)
        #         selected_app.status = "accepted"
        #         selected_app.save()

        #         # Reject all others
        #         JobApplication.objects.filter(job=job).exclude(freelancer_id=freelancer_id).update(status="rejected")

        #         job.status = "in_progress"
        #         job.selected_freelancer = selected_app.freelancer
        #         job.save()
        # except JobApplication.DoesNotExist:
        #     return Response({"error": "Freelancer did not apply for this job."}, status=status.HTTP_404_NOT_FOUND)

        # return Response({"message": f"{selected_app.freelancer.username} has been selected."})
##################
        if request.method == "POST":
            freelancer_id = request.data.get("selected_freelancer")
            if not freelancer_id:
                return Response({"error": "freelancer_id is required"}, status=400)

            try:
                selected_freelancer = User.objects.get(id=freelancer_id)
                selected_bid = Bid.objects.get(job=job, freelancer=selected_freelancer)
            except (User.DoesNotExist, Bid.DoesNotExist):
                return Response({"error": "Invalid freelancer or bid"}, status=400)

            with transaction.atomic():
                selected_bid.status = "accepted"
                selected_bid.save()

                Bid.objects.filter(job=job).exclude(id=selected_bid.id).update(status="rejected")

                job.status = "in progress"
                job.selected_freelancer = selected_freelancer
                job.save()

            return Response({"message": "Freelancer selected and job updated."})

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by("-submitted_at")
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)  # Assign freelancer automatically