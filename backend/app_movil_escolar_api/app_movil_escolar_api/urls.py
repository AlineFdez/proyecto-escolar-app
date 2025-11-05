# backend/urls.py

from django.contrib import admin
from django.urls import path, include  # Asegúrate de importar 'include'

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Esta línea envía cualquier URL que empiece con 'api/'
    # al archivo urls.py de tu aplicación.
    path('api/', include('app_movil_escolar_api.urls')), 
]