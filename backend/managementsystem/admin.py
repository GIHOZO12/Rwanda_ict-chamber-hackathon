from django.contrib import admin
from .models import (User, Cell, Village, GovernmentAgency, CitizenComplaint, ComplaintResponse,
                    Sector, District, Province)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    readonly_fields = ('id',)

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'province')
    list_filter = ('province',)
    search_fields = ('name',)

@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'district')
    list_filter = ('district',)
    search_fields = ('name',)

@admin.register(Cell)
class CellAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'sector')
    list_filter = ('sector',)
    search_fields = ('name',)

@admin.register(Village)
class VillageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'cell')
    list_filter = ('cell',)
    search_fields = ('name',)

@admin.register(GovernmentAgency)
class GovernmentAgencyAdmin(admin.ModelAdmin):
    list_display = ('id','agency_code', 'name', 'category', 'email', 'phone')
    list_filter = ('category',)
    search_fields = ('name', 'email')

@admin.register(CitizenComplaint)
class CitizenComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'status', 'location', 'created_at', 'assigned_to')
    list_filter = ('category', 'status', 'assigned_to')
    search_fields = ('description',)
    readonly_fields = ('created_at', 'updated_at')

    
    def location(self, obj):
        return obj.location.name if obj.location else None
    location.short_description = 'Village'

@admin.register(ComplaintResponse)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'complaint', 'responder', 'created_at')
    list_filter = ('complaint__status',)
    search_fields = ('message',)
    readonly_fields = ('created_at',)

    def complaint(self, obj):
        return f"Complaint #{obj.complaint.id}"
    complaint.short_description = 'Complaint'