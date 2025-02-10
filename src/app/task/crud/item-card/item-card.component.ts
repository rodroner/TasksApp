import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { Task } from '../../models/task.model';
import { User } from '../../../user/models/user.model';


import { BoardComponent } from '../../board/board.component';
import { ButtonEditComponent } from './button-edit/button-edit.component';
import { ButtonRemoveComponent } from './button-remove/button-remove.component';
import { ButtonViewComponent } from './button-view/button-view.component';

import { TaskService } from '../../service/task.service';
import { UserService } from '../../../user/service/user.service';
import { CategoryService } from '../../../category/services/category.service';
import { Category } from '../../../category/models/category.model';
import { SprintService } from '../../../sprint/services/sprint.service';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ButtonEditComponent,
    ButtonRemoveComponent,
    ButtonViewComponent
]
})
export class ItemCardComponent {

  @Input() task: Task | undefined;

  @Input() tasksList: Task[] = [];

  @Output() taskUpdate = new EventEmitter<Task[]>();

  @Output() taskRemove = new EventEmitter<Task[]>();

  @Output() processChanged = new EventEmitter<Task>();

  categoryList: Category[] = [];

  userList: User[] = [];

  //div para select de asignar usuario a tarea
  divSelectUserList = false;
  //btn para select de asignar usuario a tarea
  btnSelectUserList = true;

  //Aux name user
  assignedUser: string = '';

  //Aux name car
  assignedCat: string = '';

  //Aux name sprint
  assignedSprint: string = '';

  //div para select de asignar categoria a tarea
  divSelectCatList = false;
  //btn para select de asignar categoria a tarea
  btnSelectCatList = true;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private catService: CategoryService,
    private sprintService: SprintService,
  ) { }

  changeProcess(task: any): void {
    console.log('changeProcess ITEM-CARD');

    this.taskService.changeProcess(task).subscribe(() => {
      task.process = task.process === 'pending selection' ? 'in progress' :
                     task.process === 'in progress' ? 'pending validation' :
                     task.process === 'pending validation' ? 'done' : 'pending selection';
    });

    this.processChanged.emit(this.task);
  }

  ngOnInit(): void {
    if (this.task?.assigned != "") {
      this.getUserAsigned();
    }
    if (this.task?.hasCategory != "") {
      this.getCategory();
    }
    if (this.task?.hasSprint != "") {
      this.getSprint();
    }
  }

  refreshTaskList() {
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.taskRemove.emit(data);
      this.taskUpdate.emit(data);
    });
  }

  getSprint() {
    if (this.task && this.task.hasSprint) {
      this.sprintService.getSprintById(this.task.hasSprint).subscribe({
        next: (selectSprint) => {
          this.assignedSprint = selectSprint.name;
        },
        error: (error) => {
          console.error('Error al encontrar el sprint item-card', error);
        }
      });
    }
  }

  getCategory() {
    if (this.task && this.task.hasCategory) {
      this.catService.getCategoryById(this.task.hasCategory).subscribe({
        next: (selectCat) => {
          this.assignedCat = selectCat.name;
        },
        error: (error) => {
          console.error('Error al encontrar la categoría item-card', error);
        }
      });
    }
  }

  getUserAsigned() {
    if (this.task != undefined) {
      if (this.task.assigned != null) {
        this.userService.getUserById(this.task.assigned).subscribe({
          next: (selectUser) => {
            this.assignedUser = selectUser.name;
          },
          error: (error) => {
            console.error('Error al encontrar el usuario', error);
          }
        });
      }
    }
  }

  showCatList(): void {
    this.catService.getCategories().subscribe((data: Category[]) => {
      this.categoryList = data;
      this.divSelectCatList = true;
      this.btnSelectCatList = false;
    });
  }

  showUserList(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.userList = data;
      this.divSelectUserList = true;
      this.btnSelectUserList = false;
    });
  }

  onCatSelect(event: Event): void {
    if ((event.target as HTMLSelectElement).value == "empty") {
      if (this.task != undefined) {
        this.task.hasCategory = "";
        this.taskService.updateTask2(this.task).subscribe({
          next: (updatedTask) => {
            console.log('Tarea actualizada correctamente:', updatedTask);
            this.divSelectCatList = false;
            this.btnSelectCatList = true;
          },
          error: (error) => {
            console.error('Error al actualizar la tarea:', error);
          }
        });
      }
      this.divSelectCatList = false;
      this.btnSelectCatList = true;

    } else {
      const selectedCatId = (event.target as HTMLSelectElement).value;

      if (this.task != undefined) {
        this.task.hasCategory = selectedCatId;
        // Llama al servicio de Task para actualizar la tarea
        this.taskService.updateTask2(this.task).subscribe({
          next: (updatedTask) => {
            console.log('Tarea actualizada correctamente:', updatedTask);
            this.getCategory();
            this.refreshTaskList();
            this.divSelectCatList = false;
            this.btnSelectCatList = true;
          },
          error: (error) => {
            console.error('Error al actualizar la tarea:', error);
          }
        });
      }
    }
  }

  onUserSelect(event: Event): void {
    if ((event.target as HTMLSelectElement).value == "empty") {
      if (this.task != undefined) {
        this.task.assigned = "";
        this.taskService.updateTask2(this.task).subscribe({
          next: (updatedTask) => {
            console.log('Tarea actualizada correctamente:', updatedTask);
            this.divSelectUserList = false;
            this.btnSelectUserList = true;
            this.refreshTaskList();
          },
          error: (error) => {
            console.error('Error al actualizar la tarea:', error);
          }
        });
      }
      this.divSelectUserList = false;
      this.btnSelectUserList = true;

    } else {
      const selectedUserId = (event.target as HTMLSelectElement).value;

      if (this.task != undefined) {
        this.task.assigned = selectedUserId;
        // Llama al servicio de Task para actualizar la tarea
        this.taskService.updateTask2(this.task).subscribe({
          next: (updatedTask) => {
            console.log('Tarea actualizada correctamente:', updatedTask);
            this.getUserAsigned();
            this.divSelectUserList = false;
            this.btnSelectUserList = true;
            this.refreshTaskList();
          },
          error: (error) => {
            console.error('Error al actualizar la tarea:', error);
          }
        });
      }
    }
  }
}
