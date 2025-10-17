from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from .views.bootstrap import VersionView
from app_movil_escolar_api.views import bootstrap
from app_movil_escolar_api.views import users
from app_movil_escolar_api.views import auth
from app_movil_escolar_api.views import alumnos
from app_movil_escolar_api.views import maestros

urlpatterns = [
    #version
        path('bootstrap/version', bootstrap.VersionView.as_view()),
    #create admin
        path('admin/', users.AdminView.as_view()),
    #admin data
        path('lista-admins/', users.AdminAll.as_view()),
    #edit admin
        #path('admins/edit/', users.AdminViewEdit.as_view()),
    #create alumno
        path('alumnos/', alumnos.AlumnosView.as_view()),
    #alumnos data
        path('lista-alumnos/', alumnos.AlumnosAll.as_view()),
    #create maestro
        path('maestros/', maestros.MaestrosView.as_view()),
    #maestros data
        path('lista-maestros/', maestros.MaestrosAll.as_view()),
        #path('admin/', alumnos.AlumnosViewEdit.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
