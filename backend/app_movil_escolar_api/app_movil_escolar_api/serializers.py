# app_movil_escolar_api/serializers.py

from rest_framework import serializers
# Asegúrate de que los nombres de los modelos importados coincidan
# exactamente con los nombres de las clases en tu archivo 'models.py'.
# La convención en Django es usar singular: Administrador, Maestro, Alumno.
from .models import Administrador, Maestro, Alumno

# --- Serializador para el modelo Administrador ---
class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        # Lista explícitamente solo los campos que necesitas para el registro.
        # Esto te da control y seguridad sobre los datos de tu API.
        fields = ['id', 'nombre', 'correo', 'password', 'clave_admin']
        
        # Opciones extra para los campos.
        extra_kwargs = {
            # 'password' será de solo escritura (no se enviará en la respuesta).
            'password': {'write_only': True},
            # 'id' será de solo lectura (no se requiere al crear).
            'id': {'read_only': True}
        }

    # Esta función se ejecuta al crear un nuevo administrador.
    # Es crucial para asegurar que la contraseña se guarde de forma segura (hasheada).
    def create(self, validated_data):
        # Usamos el método create_user que maneja el hasheo de la contraseña.
        # Este método debe existir en el manager de tu modelo de usuario personalizado.
        administrador = Administrador.objects.create_user(**validated_data)
        return administrador


# --- Serializador para el modelo Maestro ---
class MaestroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maestro
        # Adapta los campos según tu modelo Maestro.
        fields = ['id', 'nombre', 'correo', 'password', 'materia']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True}
        }
    
    def create(self, validated_data):
        maestro = Maestro.objects.create_user(**validated_data)
        return maestro


# --- Serializador para el modelo Alumno ---
class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        # Adapta los campos según tu modelo Alumno.
        fields = ['id', 'nombre', 'correo', 'password', 'grado', 'grupo']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True}
        }

    def create(self, validated_data):
        alumno = Alumno.objects.create_user(**validated_data)
        return alumno