import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MaestrosService } from '../../services/maestros.service';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};


  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestros:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  // para el select
public areas: any[] = [
  { value: '1', viewValue: 'Desarrollo web' },
  { value: '2', viewValue: 'Programación' },
  { value: '3', viewValue: 'Base de datos' },
  { value: '4', viewValue: 'Redes' },
  { value: '5', viewValue: 'Matemáticas' },
];

public materias:any[] = [
  { value: '1', nombre: 'Aplicaciones web' },
  { value: '2', nombre: 'Programacion 1' },
  { value: '3', nombre: 'Bases de datos' },
  { value: '4', nombre: 'Tecnologias Web' },
  { value: '5', nombre: 'Mineria de datos' },
  { value: '6', nombre: 'Desarrollo de movil' },
  { value: '7', nombre: 'Estructuras de datos' },
  { value: '8', nombre: 'Administracion de redes' },
  { value: '9', nombre: 'Ingenieria de software' },
  { value: '10', nombre: 'Administracion de sistemas operativos' },
];

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private maestrosService: MaestrosService,
    private facadeService: FacadeService,
    private router: Router
  ) {
    this.maestros = this.maestrosService.esquemaMaestro();
  }


  ngOnInit(): void {
    //el primer if valida si existe un parametro en la url
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //asignamos a nuestra variable global el valor del id que viene en la url
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID user: ", this.idUser);
      //al iniciar la vista asignamos los datos del usuario a la variable user
      this.maestros = this.datos_user;
    }else{
      this.maestros = this.maestrosService.esquemaMaestro();
      this.maestros.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //imprime datos en consola
    console.log("Maestro: ", this.maestros);
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    this.errors = {};
    this.errors = this.maestrosService.validarMaestros(this.maestros, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    //validar si las contraseñas coinciden
    if (this.maestros.password != this.maestros.confirmar_password) {
      alert("Las contraseñas no coinciden");
      return false;
    }

    //consumir servicio para registrar maestros
    this.maestrosService.registrarMaestros(this.maestros).subscribe({
      next: (response:any) => {
        //aqui va la ejecucion del servicio si todo sale bien
        alert("maestro registrado correctamente");
        console.log("maestro registrado:", response);

        //validar si se registro que entonces navegue a la lista de maestros
        if(this.token != ""){
          this.router.navigate(['maestro']);
        }else{
          this.router.navigate(['/']);
        }

      },
      error: (error:any) => {
        if(error.status == 422){
          this.errors = error.error.errors;
        } else {
          alert("Error al registrar el maestro");
        }
      }
    });
  }

  public actualizar(){

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

  //Funcion para detectar cambios en la fecha
  public changeFecha(event: any){
    console.log(event);
    console.log(event.value.toISOString());

    this.maestros.fecha_nacimiento = event.value.toISOString().split('T')[0];
    console.log("Fecha: ", this.maestros.fecha_nacimiento);
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

  // funciones para los checkbox
  public checkboxChange(event:any) {
    console.log("Evento: ",event);
    if(event.checked) {
      this.maestros.materias_json.push(event.source.value);
    }else{
      console.log(event.source.value);
      this.maestros.materias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.maestros.materias_json.splice(i,1);
        }
      });
    }
    console.log("Array materias: ",this.maestros);
  }


  public revisarSeleccion(nombre:string){
    if(this.maestros.materias_json){
      var busqueda = this.maestros.materias_json.find((element) => element == nombre);
      if(busqueda!=undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
}
