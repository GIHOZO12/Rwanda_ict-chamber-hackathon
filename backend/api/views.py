from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings 
from managementsystem.models import (
    User, District, Province,
      Sector, Cell, 
    Village, GovernmentAgency,
      CitizenComplaint, ComplaintResponse
)
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.response import Response
from api.serializer import (
    UserSerializer,
    DistrictSerializer,
    ProvinceSerializer,
    AgencyDashboardSerializer,
    AgencyAuthSerializer,
    ResponseSerializer,
    SectorSerializer,
    CellSerializer,
    VillageSerializer,
    GovernmentAgencySerializer,
    CitizensComplaintsSerializer,
    ResponseSerializer,
)


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
        








class LoginView(APIView):
    permission_classes=[AllowAny]
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user=authenticate(email=email, password=password)
        if user is not None:
            refresh_token=RefreshToken.for_user(user)
            return Response({
                "refresh":str(refresh_token),
                "access":str(refresh_token.access_token),
                "username":user.username,
            })
        else:
            return Response({"error":"Invalid credentials"}, status=401)
            


class CurrentUserView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, *args, **kwargs):
        serializer=UserSerializer(request.user)
        return Response(serializer.data)
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=400)
                
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        



class ProvinceList(generics.ListAPIView):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer

class DistrictList(generics.ListAPIView):
      serializer_class = DistrictSerializer
      def get_queryset(self):
          province_id = self.kwargs['province_id']
          return District.objects.filter(province_id=province_id)
      
class SectorList(generics.ListAPIView):
      serializer_class = SectorSerializer
      def get_queryset(self):
          district_id = self.kwargs['district_id']
          return Sector.objects.filter(district_id=district_id)
      
class CellList(generics.ListAPIView):
      serializer_class = CellSerializer
      def get_queryset(self):
          sector_id = self.kwargs['sector_id']
          return Cell.objects.filter(sector_id=sector_id)
      
class VillageList(generics.ListAPIView):
      serializer_class = VillageSerializer
      def get_queryset(self):
          cell_id = self.kwargs['cell_id']
          return Village.objects.filter(cell_id=cell_id)
      
class GovernmentAgencyList(generics.ListAPIView):
      serializer_class = GovernmentAgencySerializer
      def get_queryset(self):
          village_id = self.kwargs['village_id']
          return GovernmentAgency.objects.filter(village_id=village_id)
      


class ComplaintCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Received data:", request.data)  
        
        serializer = CitizensComplaintsSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            complaint = serializer.save(user=request.user)
            
            
            
            response_data = serializer.data
            if complaint.assigned_to:
                response_data['assigned_to'] = complaint.assigned_to.name
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        print("Validation errors:", serializer.errors)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

      


class UserComplaintsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        complaints = CitizenComplaint.objects.filter(user=request.user).order_by('-created_at')
        
     
        serializer = CitizensComplaintsSerializer(complaints, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    







class AgencyLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = AgencyAuthSerializer(data=request.data)
        if serializer.is_valid():
            agency_code = serializer.validated_data['agency_code']
            password = serializer.validated_data['password']
            
            try:
                agency = GovernmentAgency.objects.get(agency_code=agency_code)
                if agency.check_password(password):
                    refresh = RefreshToken.for_user(agency.user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'agency': AgencyDashboardSerializer(agency).data
                    }, status=status.HTTP_200_OK)
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            except GovernmentAgency.DoesNotExist:
                return Response({'error': 'Agency not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AgencyDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
        
            agency = request.user.government_agency.first()  
            
            if not agency:
                return Response(
                    {'error': 'User is not associated with an agency'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
                
            complaints = CitizenComplaint.objects.filter(
                assigned_to=agency
            ).order_by('-created_at')
            
            data = {
                'agency': AgencyDashboardSerializer(agency).data,
                'complaints': CitizensComplaintsSerializer(complaints, many=True).data,
                'stats': {
                    'total': complaints.count(),
                    'submitted': complaints.filter(status='Submitted').count(),
                    'in_progress': complaints.filter(status='In Progress').count(),
                    'resolved': complaints.filter(status='Resolved').count(),
                    'rejected': complaints.filter(status='Rejected').count(),
                }
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        





from django.db.models import Q

class AgencyComplaintListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CitizensComplaintsSerializer
    
    def get_queryset(self):
        
        agency = self.request.user.government_agency.first()
        if not agency:
            return CitizenComplaint.objects.none()
        
        queryset = CitizenComplaint.objects.filter(assigned_to=agency).order_by('-created_at')
        
        # Apply filters
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
            
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
            
        return queryset        
    





class CitizenResponseView(APIView):
    def post(self, request, complaint_id):
        try:
            complaint = CitizenComplaint.objects.get(id=complaint_id, user=request.user)
            
            serializer = ResponseSerializer(data=request.data)
            if serializer.is_valid():
                
                response = serializer.save(
                    complaint=complaint,
                    complaint_owner=request.user,
                    responder=request.user,
                    is_agency_response=False
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except CitizenComplaint.DoesNotExist:
            return Response(
                {"error": "Complaint not found or not owned by user"},
                status=status.HTTP_404_NOT_FOUND
            )


class UserComplaintResponsesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        responses = ComplaintResponse.objects.filter(
            Q(complaint__user=request.user) |  
            Q(responder=request.user)         
        ).select_related(
            'complaint',
            'agency',
            'responder'
        ).order_by('-created_at')

        serializer = ResponseSerializer(responses, many=True)
        
        
        received = []
        sent = []
        
        for response in serializer.data:
            if response.get('responder') != request.user.id:
                received.append(response)
            else:
                sent.append(response)
        
        return Response({
            'received_responses': received,
            'sent_responses': sent
        }, status=status.HTTP_200_OK)
    








class ComplaintDetailView(generics.RetrieveAPIView):
    """
    Retrieve complaint details and its responses
    """
    serializer_class = CitizensComplaintsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CitizenComplaint.objects.filter(user=self.request.user)

    def get_object(self):
        ticket_number = self.kwargs.get('ticket_number')
        return get_object_or_404(self.get_queryset(), id=ticket_number)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        
        responses = ComplaintResponse.objects.filter(
            complaint=instance,
            is_public=True
        ).order_by('created_at')
        
        response_serializer = ResponseSerializer(responses, many=True)
        
        data = serializer.data
        data['responses'] = response_serializer.data
        
        return Response(data)


class PublicComplaintTrackingView(generics.RetrieveAPIView):
    """
    Public endpoint to track complaints without authentication
    """
    serializer_class = CitizensComplaintsSerializer
    queryset = CitizenComplaint.objects.all()

    def get_object(self):
        ticket_number = self.kwargs.get('ticket_number')
        return get_object_or_404(self.get_queryset(), id=ticket_number)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        
        responses = ComplaintResponse.objects.filter(
            complaint=instance,
            is_public=True
        ).order_by('created_at')
        
        response_serializer = ResponseSerializer(responses, many=True)
        
        data = serializer.data
        data['responses'] = response_serializer.data
        
        return Response(data)
