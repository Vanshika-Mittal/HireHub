from django.urls import path
from .views import register, job_list, post_job, edit_job
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('', job_list, name='job_list'),
    path('jobs/new/', post_job, name='post_job'),
    path('jobs/edit/<int:job_id>/', edit_job, name = 'edit_job'),
]
