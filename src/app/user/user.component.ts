import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { User } from './models/user.model';
import { UserService } from './service/user.service';
import { TaskService } from '../task/service/task.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
  ]
})
export class UserComponent {

  usersList: User[] = [];

  user = {
    name: "",
    role: "user"
  }

  idUserAux = "";

  showModal = false;

  showModalUpdate = false;

  userAuxData: any = { id: '', name: '', role: '' };
  storedUser: string | null = "";

  constructor(
    private userService: UserService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.refreshUserList();
    this.getUserInLocalStorage();
  }

  refreshUserList(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.usersList = users;
      },
      error: () => {
        console.error('Error al obtener la lista de usuarios');
      },
    });
  }

  getUserInLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.storedUser = localStorage.getItem('userLoged');
      if (this.storedUser) {
        this.userService.getUserByName(this.storedUser).subscribe({
          next: (users: User[]) => {
            this.userAuxData = {
              id: users[0].id,
              name: users[0].name,
              role: users[0].role,
            };
          }

        });
      }else{
        this.userAuxData = {
          id: '',
          name: '',
          role: '',
        };

      }
    }
  }

  changeRole(user: any): void {
    this.userService.changeRole(user).subscribe(() => {
      user.role = user.role === 'user' ? 'developer' : user.role === 'developer' ? 'admin' : 'user';
    });
  }

  onSubmit() {
    console.log(this.user);

    this.userService.createUser(this.user).subscribe(() => {
      Swal.fire({
        title: 'Usuario creado',
        text: 'El usuario "' + this.user.name + '" ha sido creado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'alert alert-success',
          confirmButton: 'btn btn-primary'
        },
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        this.showModal = false;
        this.refreshUserList();

      });
    });
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer. Todas las tareas asociadas perderán este usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'alert alert-warning',
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.deleteUser(userId).subscribe({
          next: () => {
            // Actualizamos las tareas para quitar el usuario antes de eliminarlo
            this.taskService.removeUserFromTasks(userId).subscribe(() => {
              Swal.fire({
                title: 'Usuario eliminado',
                text: 'El usuario ha sido eliminado exitosamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                customClass: {
                  popup: 'alert alert-success',
                  confirmButton: 'btn btn-primary',
                },
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {
                this.hiddeModalUpdate();
                this.refreshUserList();
              });
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el usuario. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                popup: 'alert alert-danger',
                confirmButton: 'btn btn-primary',
              },
            });
          },
        });
      }
    });
  }

  updateUser(userId: string) {
    if (userId != undefined) {
      this.userService.updateUser(userId, this.user).subscribe(() => {
        Swal.fire({
          title: 'Usuario actualizado',
          text: `El usuario "${userId}" ha sido actualizada exitosamente a "${this.user.name}"`,
          icon: 'info',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'alert alert-primary',
            confirmButton: 'btn btn-primary'
          },
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.hiddeModalUpdate();
          this.refreshUserList();
        });
      });
    }
  }

  showFormModal() {
    this.showModal = true;
  }

  hiddeModal() {
    this.showModal = false;
    this.user = {
      name: this.user.name,
      role: "user",
    }
  }

  showFormModalUpdate(userId: string, userName: string) {
    this.showModalUpdate = true;
    this.idUserAux = userId;
    this.user = {
      name: userName,
      role: this.user.role,
    }
  }

  hiddeModalUpdate() {
    this.showModalUpdate = false;
    this.user = {
      name: "",
      role: this.user.role,
    }
  }
}
