from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, FreelancerProfile, ClientProfile, Project, Bid

# Custom User Admin (Extends Django's Default UserAdmin)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('user_type', 'contact_info')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(FreelancerProfile)
admin.site.register(ClientProfile)
admin.site.register(Project)
admin.site.register(Bid)
