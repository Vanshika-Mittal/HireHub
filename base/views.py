from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from .models import Project
from .forms import JobForm, CustomUserCreationForm
from .models import Job
from django.http import HttpResponseForbidden
from django.db.models import Q

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
    min_pay = request.GET.get("min_pay")
    max_pay = request.GET.get("max_pay")
    keyword = request.GET.get("keyword", "").strip()  # Get keyword and remove extra spaces

    # Get all jobs
    jobs = Job.objects.all()

    # Apply filters
    if min_pay:
        jobs = jobs.filter(budget__gte=min_pay)
    if max_pay:
        jobs = jobs.filter(budget__lte=max_pay)
    if keyword:
        jobs = jobs.filter(
            Q(title__icontains=keyword) | 
            Q(topic__icontains=keyword) | 
            Q(description__icontains=keyword)
        )

    # Get distinct job topics
    job_topics = Job.objects.values_list("topic", flat=True).distinct()

    return render(request, "base/jobs.html", {"jobs": jobs, "topics": job_topics})


# View for Creating a New Job Posting

# @login_required
# @client_required
def create_job(request):
    if request.user.user_type != "client":
        return HttpResponseForbidden("Only clients can create jobs.")
    
    if request.method == 'POST':
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit = False)
            job.created_by = request.user
            job.save()
            return redirect("job_list")
    else:
        form = JobForm()

        # project_name = request.POST['project_name']
        # project_topic = request.POST['project_topic']
        # description = request.POST['description']
        # budget = request.POST['budget']
        # skills_required = request.POST['skills_required']
        
        # Project.objects.create(
        #     project_name=project_name,
        #     description=description,
        #     client=request.user,
        #     budget=budget,
        #     skills_required=skills_required
        # )
        # return redirect('base/job_list')
    
    return render(request, 'create_job.html')

# @login_required
# @client_required
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
# @client_required
def delete_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    job.delete()
    return redirect("job_list")

# @login_required
# @client_required
def edit_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)  # Ensure only job owner can edit
    if request.method == "POST":
        form = JobForm(request.POST, instance=job)
        if form.is_valid():
            form.save()
            return redirect('job_list')
    else:
        form = JobForm(instance=job)
    return render(request, 'base/edit_job.html', {'form': form, 'job': job})