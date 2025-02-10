import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { Sprint } from './models/sprint.model';
import { SprintService } from './services/sprint.service';
import { TaskService } from '../task/service/task.service';
import { Task } from '../task/models/task.model';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.css',
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
export class SprintComponent implements OnInit {

  sprintList: Sprint[] = [];

  taskInSprints: Task[] = [];

  sprint = {
    name: ""
  }

  idSprintAux = "";

  showModal = false;

  showModalUpdate = false;

  constructor(
    private sprintService: SprintService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.refreshSprintList();
    this.getTaskInSprint();
  }

  refreshSprintList() {
    this.sprintService.getSprints().subscribe((data: Sprint[]) => {
      this.sprintList = data;
    });
  }

  getTaskInSprint(){
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.taskInSprints = data;
    });
  }

  getTasksForSprint(sprintId: string): Task[] {
    return this.taskInSprints.filter(task => task.hasSprint === sprintId);
  }

  onSubmit() {
    // Llama a createTask y se suscribe para insertar la tarea
    this.sprintService.createSprint(this.sprint).subscribe(() => {
      Swal.fire({
        title: 'Sprint creado',
        text: 'El Sprint "' + this.sprint.name + '" ha sido creado exitosamente',
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
        this.refreshSprintList();

      });

      // Limpia los inputs del formulario
    });
  }

  deleteSprint(sprintId: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer. Todas las tareas asociadas perderán este sprint.",
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
        // Actualizamos las tareas para quitar el sprint antes de eliminarlo
        this.taskService.removeSprintFromTasks(sprintId).subscribe({
          next: () => {
            console.log('Tareas con ese sprint han sido actualizadas');
          },
          error: (err) => {
            console.error('Error al actualizar las tareas:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudieron actualizar las tareas. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                popup: 'alert alert-danger',
                confirmButton: 'btn btn-primary',
              },
            });
          },
        });

        // Ahora eliminamos el sprint
        this.sprintService.deleteSprint(sprintId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Sprint eliminado',
              text: 'El sprint ha sido eliminado exitosamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                popup: 'alert alert-success',
                confirmButton: 'btn btn-primary',
              },
              timer: 2000,
              timerProgressBar: true,
            });

            this.refreshSprintList();
          },
          error: (err) => {
            console.error('Error al eliminar el sprint:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el sprint. Intenta nuevamente.',
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

  updateSprint(sprintId: string) {

    if (sprintId !== undefined) {
      this.sprintService.updateSprint(sprintId, this.sprint).subscribe(() => {
        Swal.fire({
          title: 'Sprint actualizado',
          text: `El Sprint "${sprintId}" ha sido actualizado exitosamente a "${this.sprint.name}"`,
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
          this.refreshSprintList();
        });
      });
    }
  }


  showFormModal() {
    this.showModal = true;
  }

  hiddeModal() {
    this.showModal = false;
  }

  showFormModalUpdate(sprintId: string, sprintName: string) {
    this.showModalUpdate = true;
    this.idSprintAux = sprintId;
    this.sprint = {
      name: sprintName
    }
  }

  hiddeModalUpdate() {
    this.showModalUpdate = false;
    this.sprint = {
      name: ""
    }
  }
}
