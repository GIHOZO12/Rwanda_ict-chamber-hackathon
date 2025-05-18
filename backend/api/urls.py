from django.urls import path
from api.views import (
    LoginView, CreateUserView,
    ProvinceList, DistrictList,
    SectorList, CellList, VillageList,
    GovernmentAgencyList,
    ComplaintCreateView,
    AgencyLoginView,
    AgencyComplaintListView,
    AgencyDashboardView,
    UserComplaintsListView,

    ComplaintDetailView,
      PublicComplaintTrackingView,
   UserComplaintResponsesView,
    CurrentUserView, LogoutView,
 CitizenResponseView
       
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', CreateUserView.as_view(), name='register'),
    path("current_user/", CurrentUserView.as_view(), name="current_user"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("provinces/", ProvinceList.as_view(), name="provinces"),
    path("provinces/<province_id>/districts/", DistrictList.as_view(), name="districts"),
    path("districts/<district_id>/sectors/", SectorList.as_view(), name="sectors"),
    path("sectors/<sector_id>/cells/", CellList.as_view(), name="cells"),
    path("cells/<cell_id>/villages/", VillageList.as_view(), name="villages"),
    path("villages/<village_id>/government_agencies/", GovernmentAgencyList.as_view(), name="government_agencies"),
    path("complaints/", ComplaintCreateView.as_view(), name="complaints_create"),
    path("my-complaints/", UserComplaintsListView.as_view(), name="user_complaints_list"),
    path("agency/login/", AgencyLoginView.as_view(), name="agency_login"),
    path("agency/dashboard/", AgencyDashboardView.as_view(), name="agency_dashboard"),
    path("agency/complaints/", AgencyComplaintListView.as_view(), name="agency_complaints_list"),
 path('citizen/response/<int:complaint_id>/', 
         CitizenResponseView.as_view(), 
         name='citizen-response'),
    path('my-responses/', UserComplaintResponsesView.as_view(), name='user_responses'),



    path('complaints/<int:ticket_number>/', ComplaintDetailView.as_view(), name='complaint-detail'),
    path('complaints/<int:ticket_number>/responses/', PublicComplaintTrackingView.as_view(), name='complaint-responses'),

    path('track-complaint/<int:ticket_number>/', PublicComplaintTrackingView.as_view(), name='track-complaint'),


]