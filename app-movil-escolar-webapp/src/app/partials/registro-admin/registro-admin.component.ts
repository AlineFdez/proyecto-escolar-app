import { Component, Input, OnInit } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public admin:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private administradoresService: AdministradoresService,
    private facadeService: FacadeService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    //el primer if valida si existe un parametro en la url
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //asignamos a nuestra variable global el valor del id que viene en la url
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID user: ", this.idUser);
      //al iniciar la vista asignamos los datos del usuario a la variable user
      this.admin = this.datos_user;
    }else{
      this.admin = this.administradoresService.esquemaAdmin();
      this.admin.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //imprime datos en consola
    console.log("Admin: ", this.admin);
  }

  public regresar(){
    this.location.back();
  }



  // Sanitiza contenido pegado en el input: elimina caracteres no permitidos
  public onPasteSanitize(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pasted = clipboardData.getData('text') as string;
    const sanitized = pasted.replace(/[^a-zA-Z0-9]/g, '');
    if (sanitized !== pasted) {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const newValue = target.value.slice(0, start) + sanitized + target.value.slice(end);
      target.value = newValue;
      // Also update the bound model if using ngModel
      try { (target as any).dispatchEvent(new Event('input')); } catch(e) {}
    }
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
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    //validar si las contraseñas coinciden
    if (this.admin.password != this.admin.confirmar_password) {
      alert("Las contraseñas no coinciden");
      return false;
    }

    //consumir servicio para registrar administradores
    this.administradoresService.registrarAdmin(this.admin).subscribe({
      next: (response:any) => {
        //aqui va la ejecucion del servicio si todo sale bien
        alert("Administrador registrado correctamente");
        console.log("admin registrado:", response);

        //validar si se registro que entonces navegue a la lista de administradores
        if(this.token != ""){
          this.router.navigate(['administrador']);
        }else{
          this.router.navigate(['/']);
        }

      },
      error: (error:any) => {
        if(error.status == 422){
          this.errors = error.error.errors;
        } else {
          alert("Error al registrar el administrador");
        }
      }
    });
  }

  public actualizar(){

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

