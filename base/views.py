from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from .forms import CustomUserCreationForm
from .models import Project
from .forms import JobForm
from .models import Job
from django.contrib.auth.decorators import login_required

# User Registration View
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # Redirect to home page
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

# View to Display Job Postings
def job_list(request):
    projects = Project.objects.filter(status='open')
    return render(request, 'base\job_list.html', {'projects': projects})

# View for Creating a New Job Posting
# @login_required
def create_job(request):
    if request.method == 'POST':
        project_name = request.POST['project_name']
        description = request.POST['description']
        budget = request.POST['budget']
        skills_required = request.POST['skills_required']
        
        Project.objects.create(
            project_name=project_name,
            description=description,
            client=request.user,
            budget=budget,
            skills_required=skills_required
        )
        return redirect('base\job_list')
    
    return render(request, 'create_job.html')

# @login_required
def job_list(request):
    jobs = Job.objects.all()
    return render(request, 'base/job_list.html', {'jobs': jobs})

# @login_required
def post_job(request):
    if request.method == "POST":
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            # job.client = request.user  # Set the logged-in user as the client
            job.save()
            return redirect('job_list')
    else:
        form = JobForm()
    return render(request, 'base/post_job.html', {'form': form})

# @login_required
def edit_job(request, job_id):
    job = get_object_or_404(Job, id=job_id, client=request.user)  # Ensure only job owner can edit
    if request.method == "POST":
        form = JobForm(request.POST, instance=job)
        if form.is_valid():
            form.save()
            return redirect('job_list')
    else:
        form = JobForm(instance=job)
    return render(request, 'base/edit_job.html', {'form': form, 'job': job})