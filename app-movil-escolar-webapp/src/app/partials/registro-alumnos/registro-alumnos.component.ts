import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { AlumnosService } from '../../services/alumnos.service';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};


  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumnos:any = {};
  public token: string = "";
  public errors:any = {};
  public editar:boolean = false;
  public idUser: Number = 0;

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private alumnosService: AlumnosService,
    private facadeService: FacadeService,
    private router: Router,
  ) {
    this.alumnos = this.alumnosService.esquemaAlumno();
  }


  ngOnInit(): void {
    //el primer if valida si existe un parametro en la url
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //asignamos a nuestra variable global el valor del id que viene en la url
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID user: ", this.idUser);
      //al iniciar la vista asignamos los datos del usuario a la variable user
      this.alumnos = this.datos_user;
    }else{
      this.alumnos = this.alumnosService.esquemaAlumno();
      this.alumnos.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //imprime datos en consola
    console.log("Alumno: ", this.alumnos);
  }

  public regresar(){
    this.location.back();
  }

  //Funciones para password
  public showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar(){
    this.errors = {};
    this.errors = this.alumnosService.validarAlumnos(this.alumnos, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    //validar si las contraseñas coinciden
    if (this.alumnos.password != this.alumnos.confirmar_password) {
      alert("Las contraseñas no coinciden");
      return false;
    }

    //consumir servicio para registrar alumnos
    this.alumnosService.registrarAlumnos(this.alumnos).subscribe({
      next: (response:any) => {
        //aqui va la ejecucion del servicio si todo sale bien
        alert("alumno registrado correctamente");
        console.log("alumno registrado:", response);

        //validar si se registro que entonces navegue a la lista de alumnos
        if(this.token != ""){
          this.router.navigate(['alumno']);
        }else{
          this.router.navigate(['/']);
        }

      },
      error: (error:any) => {
        if(error.status == 422){
          this.errors = error.error.errors;
        } else {
          alert("Error al registrar el alumno");
        }
      }
    });

  }

  public actualizar(){

  }

  //Funcion para detectar cambios en la fecha
  public changeFecha(event: any){
    console.log(event);
    console.log(event.value.toISOString());

    this.alumnos.fecha_nacimiento = event.value.toISOString().split('T')[0];
    console.log("Fecha: ", this.alumnos.fecha_nacimiento);
  }

  // Función para los campos solo de datos alfabeticos
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  public soloLetrasNumeros(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);

  // Permitir letras (mayúsculas y minúsculas), números y espacio
  if (
    !(charCode >= 65 && charCode <= 90) &&   // Letras mayúsculas (A-Z)
    !(charCode >= 97 && charCode <= 122) &&  // Letras minúsculas (a-z)
    !(charCode >= 48 && charCode <= 57) &&   // Números (0-9)
    charCode !== 32                          // Espacio
  ) {
    event.preventDefault();
    }
  }

}
