from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    project_name = models.CharField(max_length=255)
    description = models.TextField()
    client = models.ForeignKey(User, on_delete=models.CASCADE)  # Job posted by a client
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    skills_required = models.JSONField(default=list, blank=True)  # Store skills as a list
    status = models.CharField(
        max_length=10,
        choices=[("open", "Open"), ("closed", "Closed")],
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
