import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import * as bcrypt from 'bcryptjs';

import { AppComponent  } from '../../core/app.component';

import { UserService } from '../service/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class AuthComponent {

  //role: 'admin' | 'developer' | 'user';
  user = {
    name: "",
    password: "",
    role: "user",
  }

  userRegister = {
    name: "",
    password: "",
    password_2: "",
    role: "user",
  }

  storedUser: string | null = "";

  constructor(
    private userService: UserService,
    private appComponent: AppComponent
  ) { }

  ngOnInit(): void {
    this.getUserInLocalStorage();

  }

  disconnect() {
    if (typeof window !== 'undefined' && window.localStorage) {
      Swal.fire({
        title: this.storedUser + ' ha sido desconectado',
        icon: 'warning',
        customClass: {
          popup: 'alert alert-danger',
        },
        timer: 2000,
        timerProgressBar: true,
      })
      localStorage.removeItem('userLoged');
      this.appComponent.getUserInLocalStorage();
      this.storedUser = null;
    }
  }

  getUserInLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.storedUser = localStorage.getItem('userLoged');
    }
  }

  passwordsMatch(): boolean {
    return this.userRegister.password === this.userRegister.password_2;
  }

  onLoginSubmit() {
    console.log('onLoginSubmit():' + this.user.name + ' ' + this.user.password);
    const nameAux = this.user.name;
    const passAux = this.user.password;

    this.userService.getUserByName(this.user.name).subscribe({
      next: (users: any[]) => {
        if (users.length === 0) {
          Swal.fire({
            title: 'El nombre de usuario no existe',
            icon: 'warning',
            customClass: {
              popup: 'alert alert-danger',
              confirmButton: 'btn btn-primary'
            },
            timer: 2000,
            timerProgressBar: true,
          })
          return;
        }

        const foundUser = users[0];
        const passwordMatches = bcrypt.compareSync(passAux, foundUser.password);

        if (passwordMatches) {
          Swal.fire({
            title: 'Inicio de sesión exitoso',
            icon: 'success',
            customClass: {
              popup: 'alert alert-success',
              confirmButton: 'btn btn-primary'
            },
            timer: 2000,
            timerProgressBar: true,
          })
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('userLoged', nameAux);
            this.storedUser = nameAux;
            this.appComponent.getUserInLocalStorage();
          }
        } else {
          Swal.fire({
            title: 'La contraseña es incorrecta',
            icon: 'warning',
            customClass: {
              popup: 'alert alert-danger',
              confirmButton: 'btn btn-primary'
            },
            timer: 2000,
            timerProgressBar: true,
          })
        }
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
      }
    });

    // Reiniciar el formulario
    this.user = {
      name: "",
      password: "",
      role: "user",
    };

  }

  onRegisterSubmit() {
    if (this.userRegister.password == this.userRegister.password_2) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(this.userRegister.password, salt);

      this.user = {
        name: this.userRegister.name,
        password: hashedPassword,
        role: "user",
      }

      this.userService.createUser(this.user).subscribe(() => {
        Swal.fire({
          title: 'Usuario registrado',
          text: 'El usuario "' + this.user.name + '" ha sido registrado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'alert alert-success',
            confirmButton: 'btn btn-primary'
          },
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('userLoged', this.user.name);
            this.storedUser = this.user.name;
            this.appComponent.getUserInLocalStorage();

            this.user = {
              name: "",
              password: "",
              role: ""
            }
            this.userRegister = {
              name: "",
              password: "",
              password_2: "",
              role: "",
            }
          } else {
            console.error('localStorage no está disponible en este entorno.');
          }
        });
      });

    } else {
      console.log('Las contraseñas no coinciden.');
    }

    this.userRegister = {
      name: "",
      password: "",
      password_2: "",
      role: "user",
    }
  }

}
