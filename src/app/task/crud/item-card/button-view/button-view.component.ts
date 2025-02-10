import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';

import { Task } from '../../../models/task.model';
import { TaskService } from '../../../service/task.service';
import { UserService } from '../../../../user/service/user.service';
import { CategoryService } from '../../../../category/services/category.service';

@Component({
  selector: 'app-button-view',
  templateUrl: './button-view.component.html',
  styleUrl: './button-view.component.css',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class ButtonViewComponent {


  @Input() task: Task | undefined;

  showModal = false;

  //Aux name user
  assignedUser: string = '';

  //Aux name car
  assignedCat: string = '';

  //Aux name taskChild
  assignedTaskChild: Task[] = [];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private catService: CategoryService) { }

  showFormModalView(): void {
    this.showModal = true;
    this.getUserAsigned();
    this.getCategory();
    this.getTaskChild();
  }

  hiddeModalView() {
    this.showModal = false;
    this.assignedTaskChild = [];
  }

  getUserAsigned() {
    if (this.task != undefined) {
      if(this.task.assigned!=null){
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

  getCategory() {
    if (this.task && this.task.hasCategory) {
      this.catService.getCategoryById(this.task.hasCategory).subscribe({
        next: (selectCat) => {
          this.assignedCat = selectCat.name;
        },
        error: (error) => {
          console.error('Error al encontrar la categoría button-view', error);
        }
      });
    }

  }

  getTaskChild() {
    if (this.task != undefined) {
      for (let index = 0; index < this.task.hasTaskChild.length; index++) {
        const idTaskChild = this.task.hasTaskChild[index];

        this.taskService.getTaskById(idTaskChild).subscribe({
          next: (selectTaskChild) => {
            this.assignedTaskChild.push(selectTaskChild);
          },
          error: (error) => {
            console.error('Error al encontrar getTaskChild button-view2', error);
          }
        });

      }
    }

  }
}
