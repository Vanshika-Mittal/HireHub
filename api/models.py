from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator 
from django.utils.timezone import now

class Bid(models.Model):
    job = models.ForeignKey("Job", on_delete=models.CASCADE, related_name="bids")
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(1)])
    bid_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")],
        default="pending"
    )

    class Meta:
        unique_together = ('job', 'freelancer')  # Ensures a freelancer can bid only once per job

    def __str__(self):
        return f"{self.freelancer.username} bid {self.bid_amount} on {self.job.project_name}"

class Job(models.Model):
    # project_name = models.CharField(max_length=255)
    # description = models.TextField()
    # client = models.ForeignKey(User, on_delete=models.CASCADE)  # Job posted by a client
    # budget = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(1)])
    # skills_required = models.JSONField(default=list, blank=True)  # Store skills as a list
    # status = models.CharField(
    #     max_length=20,
    #     choices=[("open", "Open"), ("closed", "Closed"), ("in progress", "In Progress")],
    #     default="open"
    # )
    # created_at = models.DateTimeField(auto_now_add=True)
    # selected_freelancer = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="selected_jobs")

    project_name = models.CharField(max_length=255)
    description = models.TextField()
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    selected_freelancer = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="selected_jobs")
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    skills_required = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[("open", "Open"), ("in progress", "In Progress"), ("closed", "Closed")],
        default="open"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.project_name

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)
    cover_letter = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer.username} applied for {self.job.title}"
