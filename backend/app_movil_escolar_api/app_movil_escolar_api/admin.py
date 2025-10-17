from django.contrib import admin
from django.utils.html import format_html
from app_movil_escolar_api.models import *


@admin.register(Administradores)
@admin.register(Alumnos)
@admin.register(Maestros)
#TODO: agregar los otros dos(alumnos y maestros)


class AdministradoresAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "creation", "update")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name")

class AlumnosAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "matricula", "grado", "grupo", "creation", "update")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name", "matricula", "grado", "grupo")

class MaestrosAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "id_trabajador", "fecha_nacimiento", "telefono", "rfc", "cubiculo", "area_investigacion", "creation", "update")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name", "id_trabajador", "telefono", "rfc", "cubiculo", "area_investigacion")