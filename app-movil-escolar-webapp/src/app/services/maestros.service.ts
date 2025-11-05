import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MaestrosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }



  public esquemaMaestro() {
    return {
      'rol': '',
      'id_trabajador': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'fecha_nacimiento': '',
      'telefono': '',
      'rfc': '',
      'cubiculo': '',
      'area_investigacion': '',
      'materias_json': []
    }
  }

   public validarMaestros(data: any, editar: boolean) {
    console.log("Validando maestro... ", data);
    let error: any = {};
    //Validaciones
    if (!this.validatorService.required(data["id_trabajador"])) {
      error["id_trabajador"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["first_name"])) {
      error["first_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["last_name"])) {
      error["last_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["email"])) {
      error["email"] = this.errorService.required;
    } else if (!this.validatorService.max(data["email"], 40)) {
      error["email"] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    // Validación para fecha de nacimiento
    if (!this.validatorService.required(data["fecha_nacimiento"])) {
      error["fecha_nacimiento"] = this.errorService.required;
    } else {
      // Opcional: validar formato de fecha
      const fecha = new Date(data["fecha_nacimiento"]);
      if (isNaN(fecha.getTime())) {
        error["fecha_nacimiento"] = "La fecha de nacimiento no es válida";
      }
    }

    // Validación para área de investigación
    if (!this.validatorService.required(data["area_investigacion"])) {
      error["area_investigacion"] = this.errorService.required;
    }

    if (!editar) {
      if (!this.validatorService.required(data["password"])) {
        error["password"] = this.errorService.required;
      }

      if (!this.validatorService.required(data["confirmar_password"])) {
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data["rfc"])) {
      error["rfc"] = this.errorService.required;
    } else if (!this.validatorService.min(data["rfc"], 12)) {
      error["rfc"] = this.errorService.min(12);
      alert("La longitud de caracteres deL RFC es menor, deben ser 12");
    } else if (!this.validatorService.max(data["rfc"], 13)) {
      error["rfc"] = this.errorService.max(13);
      alert("La longitud de caracteres deL RFC es mayor, deben ser 13");
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["cubiculo"])){
      error["cubiculo"] = this.errorService.required;
    }

    // Validación para materias seleccionadas (materias_json debe ser un array no vacío)
    if (!data["materias_json"] || !Array.isArray(data["materias_json"]) || data["materias_json"].length === 0) {
      error["materias_json"] = this.errorService.required;
    }

    //Return arreglo
    return error;
  }

  //aqui van los servicios HTTP
  //Servicio para agregar un administrador
  public registrarMaestros(data: any): Observable <any> {
    return this.http.post<any>(`${environment.url_api}/maestros/`,data,httpOptions);
  }


}
