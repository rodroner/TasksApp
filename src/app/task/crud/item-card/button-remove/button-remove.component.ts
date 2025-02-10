import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

import { Task } from '../../../models/task.model';
import { TaskService } from '../../../service/task.service';

@Component({
  selector: 'app-button-remove',
  templateUrl: './button-remove.component.html',
  styleUrl: './button-remove.component.css',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class ButtonRemoveComponent {

  @Input() task: Task | undefined;

  @Output() taskRemove = new EventEmitter<any>();

  currentTask: { id: string; name: string; assigned: string; difficulty: number; process: 'pending selection' | 'in progress' | 'pending validation' | 'done'; } | null | undefined;

  showModal = false;

  constructor(private taskService: TaskService) {}

  refreshTaskList() {
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.taskRemove.emit(data);
    });
  }

  showFormModal(id: string | undefined): void {
    this.showModal = true;
    this.currentTask = this.task;
  }

  hiddeModal(){
    this.showModal = false;
  }

  removePermanent() {
    if (this.currentTask != null) {
      console.log(`Eliminando tarea con id: ${this.currentTask.id}`);

      this.taskService.deleteTask(this.currentTask.id).subscribe(() => {
        Swal.fire({
          title: 'Tarea eliminada',
          text: `La tarea "${this.currentTask?.name}" ha sido eliminada exitosamente.`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'alert alert-danger',
            confirmButton: 'btn btn-primary'
          },
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.showModal = false;
          this.refreshTaskList();
        });

      }, error => {
        console.error('Error eliminando la tarea:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la tarea. Intente de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      });
    }
  }


}
