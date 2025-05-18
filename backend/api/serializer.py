from rest_framework import serializers
from managementsystem.models import User, District, Province, Sector, Cell, Village, GovernmentAgency, CitizenComplaint, ComplaintResponse

from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone_number',
            'password', 'is_citizen', 'is_government', 'is_staff', 'is_active', 'date_joined'
        ]
        extra_kwargs = {
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'date_joined': {'read_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  
        user.save()
        return user





class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id', 'name']
class DistrictSerializer(serializers.ModelSerializer):
    province = ProvinceSerializer(read_only=True) 

    class Meta:
        model = District
        fields = ['id', 'name', 'province']



class SectorSerializer(serializers.ModelSerializer):
    district = DistrictSerializer(read_only=True)  

    class Meta:
        model = Sector
        fields = ['id', 'name', 'district']


class CellSerializer(serializers.ModelSerializer):
    sector = SectorSerializer(read_only=True)

    class Meta:
        model = Cell
        fields = ['id', 'name', 'sector']



class VillageSerializer(serializers.ModelSerializer):
    cell = CellSerializer(read_only=True)  

    class Meta:
        model = Village
        fields = ['id', 'name', 'cell']

class GovernmentAgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentAgency
        fields = ['id', 'name', 'province']



class CitizensComplaintsSerializer(serializers.ModelSerializer):
    location = VillageSerializer(read_only=True)  
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Village.objects.all(),
        source='location',  
        write_only=True
    )
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
   
    class Meta:
        model = CitizenComplaint
        fields = [
            'id', 'title', 'description', 'category', 
            'location', 'location_id', 'status', 'created_at', 
            'attachment', 'priority',
        ]
        extra_kwargs = {'attachment': {'write_only': True}, 'priority': {'write_only': True}, 'created_at': {'read_only': True}, 'updated_at': {'read_only': True},'id': {'read_only': True}}


class ResponseSerializer(serializers.ModelSerializer):
      
    class Meta:
        model = ComplaintResponse
        fields = ['id', 'message', 'is_public', 'complaint', 'responder', 'is_agency_response', 'agency']
        extra_kwargs = {
            'complaint': {'required': False},
            'responder': {'required': False},
            'is_agency_response': {'required': False},
            'agency': {'required': False}
        }



class AgencyAuthSerializer(serializers.Serializer):
    agency_code = serializers.CharField(max_length=10)
    password = serializers.CharField(write_only=True)

class AgencyDashboardSerializer(serializers.ModelSerializer):
    class Meta: 
        model = GovernmentAgency
        fields = ['id', 'name', 'category', 'email', 'phone', 'agency_code']
        extra_kwargs = {'agency_code': {'read_only': True}}

class ResponseSerializer(serializers.ModelSerializer):
    complaint_title = serializers.CharField(source='complaint.title', read_only=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True, allow_null=True)
    responder = serializers.PrimaryKeyRelatedField(read_only=True)  # Add this line
    responder_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ComplaintResponse
        fields = [
            'id',
            'message',
            'is_public',
            'is_agency_response',
            'created_at',
            'complaint_title',
            'agency_name',
            'responder',  
            'responder_name'
        ]
    
    def get_responder_name(self, obj):
        if obj.responder:
            return f"{obj.responder.first_name} {obj.responder.last_name}"
        return None