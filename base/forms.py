from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm
from .models import User
from .models import Job

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'user_type', 'contact_info']

class JobForm(ModelForm):
    class Meta:
        model = Job
        fields = ['title', 'topic', 'description', 'budget', 'deadline']

# class RegisterForm(UserCreationForm):
#     USER_TYPES = (
#         ("client", "Client"),
#         ("freelancer", "Freelancer"),
#     )
#     user_type = forms.ChoiceField(choices=USER_TYPES, widget=forms.RadioSelect)

#     class Meta:
#         model = User
#         fields = ["username", "email", "password1", "password2", "user_type"]