import django_filters
from django_filters import rest_framework as filters
from django.db.models import JSONField
from .models import Job

class JobFilter(filters.FilterSet):
    skills_required = filters.CharFilter(method='filter_skills')

    class Meta:
        model = Job
        fields = ['skills_required']
        filter_overrides = {
            JSONField: {
                'filter_class': django_filters.CharFilter,
            },
        }

    def filter_skills(self, queryset, name, value):
        """Filter jobs by skills for SQLite."""
        skills = value.split(",")  # Convert comma-separated values to a list
        for skill in skills:
            queryset = queryset.filter(skills_required__icontains=skill)  # ✅ SQLite-friendly
        return queryset