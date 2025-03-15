
from django.contrib.auth.models import User
from django.db import models

class User(User):
    USER_TYPES = [
        ('Freelancer', 'Freelancer'),
        ('Client', 'Client'),
    ]
    
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    contact_info = models.CharField(max_length=255, blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


# Freelancer Profile
class FreelancerProfile(models.Model):
    freelancer = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    skills = models.TextField()
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    experience = models.IntegerField()
    portfolio = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Freelancer: {self.freelancer.username}"


# Client Profile
class ClientProfile(models.Model):
    client = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    business_type = models.CharField(max_length=255, blank=True, null=True)
    # contact_info = models.CharField(max_length=255, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Client: {self.client.username}"


# Project Model (Job Posting)
class Project(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    project_name = models.CharField(max_length=255)
    description = models.TextField()
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    skills_required = models.TextField()
    posted_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    def __str__(self):
        return self.project_name


# Bids Model
class Bid(models.Model):
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    bid_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='rejected')

    def __str__(self):
        return f"Bid by {self.freelancer.username} on {self.project.project_name}"

# User = get_user_model()

class Job(models.Model):
    title = models.CharField(max_length = 255)
    topic = models.CharField(max_length = 255, default = "General")
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateField()
    # created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    # topic = models.CharField(max_length = 255)
    # client = models.ForeignKey(User, on_delete=models.CASCADE, null = True)  # Link job to user

    def __str__(self):
        return self.title