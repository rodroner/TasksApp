import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';

import Swal from 'sweetalert2';

import { UserService } from '../../../user/service/user.service'
import { User } from '../../../user/models/user.model';
import { CategoryService } from '../../../category/services/category.service'
import { Category } from '../../../category/models/category.model'
import { TaskService } from '../../service/task.service';
import { Task } from '../../models/task.model';
import { Sprint } from '../../../sprint/models/sprint.model';
import { SprintService } from '../../../sprint/services/sprint.service';

declare var $: any;

@Component({
  selector: 'app-item-card-add',
  templateUrl: './item-card-add.component.html',
  styleUrl: './item-card-add.component.css',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
  ]
})
export class ItemCardAddComponent {

  @Output() taskAdded = new EventEmitter<any>();

  tasksList: Task[] = [];

  sprintList: Sprint[] = [];

  categoryList: Category[] = [];

  usersList: User[] = [];

  task = {
    name: "",
    assigned: "",
    hasCategory: "",
    hasSprint: "",
    hasTaskChild: [] as string[],
    difficulty: 0,
    process: "pending selection"
  }

  category = {
    name: ""
  }

  showModal = false;

  // Propiedad para la dificultad seleccionada
  selectedDifficulty: number = 0;

  // Propiedad para la dificultad actual que se está 'hovereando'
  hoverDifficulty: number = 0;

  constructor(
    private taskService: TaskService,
    private sprintService: SprintService,
    private catService: CategoryService,
    private userService: UserService) { }

  refreshTaskList() {
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.taskAdded.emit(data);
    });
  }

  onMouseEnter(difficulty: number): void {
    this.hoverDifficulty = difficulty;
  }

  onMouseLeave(): void {
    this.hoverDifficulty = 0;
  }

  selectDifficulty(difficulty: number): void {
    this.selectedDifficulty = difficulty;
    this.task.difficulty = difficulty;
  }

  pickChildTask(event: MatSlideToggleChange, idTask: string): void {
    if(event.checked==true){
      if (!this.task.hasTaskChild.includes(idTask)) {
        this.task.hasTaskChild.push(idTask);
      }
    }else {
      this.task.hasTaskChild = this.task.hasTaskChild.filter(taskId => taskId !== idTask);
    }
  }

  selectCategory(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    //isEpic
    if (selectedValue == '0000') {
      $('.isEpicTask').removeClass('d-none');
    } else {
      $('.isEpicTask').addClass('d-none');
    }
  }

  onSubmit() {
    console.log(this.task);

    // Llama a createTask y se suscribe para insertar la tarea
    this.taskService.createTask(this.task).subscribe(() => {
      Swal.fire({
        title: 'Tarea creada',
        text: 'La tarea "' + this.task.name + '" ha sido creada exitosamente',
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
        this.refreshTaskList();

      });
    });
  }

  showFormModal() {
    this.showModal = true;

    this.sprintService.getSprints().subscribe((data: Sprint[]) => {
      this.sprintList = data;
    });

    this.catService.getCategories().subscribe((data: Category[]) => {
      this.categoryList = data;
    });

    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.tasksList = data;
    });

    this.userService.getUsers().subscribe((data: User[]) => {
      this.usersList = data;
    });
  }

  hiddeModal() {
    this.showModal = false;
  }
}
