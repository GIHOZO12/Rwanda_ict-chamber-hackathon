from django.db import models
from django.contrib.auth.models import AbstractUser
import secrets
from django.contrib.auth.hashers import make_password
class User(AbstractUser):
    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    is_citizen = models.BooleanField(default=True)
    is_government = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    def __str__(self):
        return self.username

COMPLAINT_CATEGORIES = [
    ('Water', 'Water'),
    ('Electricity', 'Electricity'),
    ('Sanitation', 'Sanitation'),
    ('Security', 'Security'),
    ('Taxation', 'Taxation'),
    ('Health', 'Health'),
    ('Education', 'Education'),
    ('Transportation', 'Transportation'),
    ('Governmental', 'Governmental'),
    ('Other', 'Other')
]

COMPLAINT_STATUS = [
    ('Submitted', 'Submitted'),
    ('In Progress', 'In Progress'),
    ('Resolved', 'Resolved'),
    ('Rejected', 'Rejected'),
]

class Province(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class District(models.Model):
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='districts')
    name = models.CharField(max_length=200)

    class Meta:
        unique_together = ('province', 'name')
    
    def __str__(self):
        return f"{self.name}, {self.province.name}"

class Sector(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='sectors')
    name = models.CharField(max_length=200)

    class Meta:
        unique_together = ('district', 'name')
    
    def __str__(self):
        return f"{self.name}, {self.district.name}"

class Cell(models.Model):
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name='cells')
    name = models.CharField(max_length=200)

    class Meta:
        unique_together = ('sector', 'name')
    
    def __str__(self):
        return f"{self.name}, {self.sector.name}"

class Village(models.Model):
    cell = models.ForeignKey(Cell, on_delete=models.CASCADE, related_name='villages')
    name = models.CharField(max_length=200)

    class Meta:
        unique_together = ('cell', 'name')
        verbose_name_plural = "Villages"
    
    def __str__(self):
        return f"{self.name}, {self.cell.name}"
    
    def get_full_location(self):
        """Returns the full hierarchical location path"""
        return f"{self.cell.sector.district.province.name} > {self.cell.sector.district.name} > {self.cell.sector.name} > {self.cell.name} > {self.name}"

class GovernmentAgency(models.Model):

    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='government_agency'
    )
    name = models.CharField(max_length=200, unique=True)
    category = models.CharField(max_length=200, choices=COMPLAINT_CATEGORIES)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    service_locations = models.ManyToManyField(District, related_name='agencies')

    agency_code = models.CharField(max_length=10, unique=True, blank=True)
    password = models.CharField(max_length=128)

    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        
        if not self.agency_code:
            self.agency_code = self.generate_agency_code()
        
      
        if self.password and not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)
            
        super().save(*args, **kwargs)
    
    def generate_agency_code(self):
        """Generate a unique 6-digit agency code"""
        while True:
            code = ''.join(secrets.choice('0123456789') for _ in range(6))
            if not GovernmentAgency.objects.filter(agency_code=code).exists():
                return code
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)


    @classmethod
    def get_default_agency_for_category(cls, category):
        """Returns the default agency for a given category"""
        agency_mapping = {
            'Water': 'WASAC',
            'Electricity': 'REG',
            'taxation': 'Rwanda Revenue Authority',
            
        }
        
        default_name = agency_mapping.get(category)
        if default_name:
            return cls.objects.filter(name=default_name).first()
        return None

class CitizenComplaint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=200)  # Added title field
    category = models.CharField(max_length=200, choices=COMPLAINT_CATEGORIES)
    description = models.TextField()
    location = models.ForeignKey(Village, on_delete=models.CASCADE, related_name='complaints')
    status = models.CharField(max_length=20, choices=COMPLAINT_STATUS, default='Submitted')
    assigned_to = models.ForeignKey(
        GovernmentAgency, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_complaints'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    attachment = models.FileField(upload_to='complaints/%Y/%m/%d/', null=True, blank=True)
    priority = models.PositiveSmallIntegerField(default=3, choices=[(1, 'High'), (2, 'Medium'), (3, 'Low')])

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Complaint #{self.id}: {self.title}"
    
    def get_status_updates(self):
     """Returns all public responses ordered by date"""
     return self.responses.filter(is_public=True).order_by('created_at')
    
    def save(self, *args, **kwargs):
        
        if not self.assigned_to:
            self.assigned_to = GovernmentAgency.get_default_agency_for_category(self.category)
        
        
        if not self.assigned_to:
            agencies = GovernmentAgency.objects.filter(category=self.category)
            
            
            if self.location:
                self.assigned_to = agencies.filter(
                    service_locations=self.location.cell.sector.district
                ).first()
                
                
                if not self.assigned_to:
                    self.assigned_to = agencies.filter(
                        service_locations__province=self.location.cell.sector.district.province
                    ).first()
        
        super().save(*args, **kwargs)


class ComplaintResponse(models.Model):
    complaint = models.ForeignKey(CitizenComplaint, on_delete=models.CASCADE, related_name='responses')
    complaint_owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_responses'
    )
    responder = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_responses'
    )
    agency = models.ForeignKey(
        GovernmentAgency, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='agency_responses'
    )
    assigned_agency = models.ForeignKey(  
        GovernmentAgency,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_complaint_responses'
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)
    is_agency_response = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['created_at']
    

    @property
    def responder_name(self):
     if self.responder:
        return f"{self.responder.first_name} {self.responder.last_name}"
     return "System"
    def save(self, *args, **kwargs):
    
        if not self.complaint_owner_id:
            self.complaint_owner = self.complaint.user
        if not self.assigned_agency_id and self.complaint.assigned_to:
            self.assigned_agency = self.complaint.assigned_to
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Response to {self.complaint}"