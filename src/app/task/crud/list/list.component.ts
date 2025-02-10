import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

import { Task } from '../../models/task.model';
import { TaskService } from '../../service/task.service';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ItemCardAddComponent } from '../item-card-add/item-card-add.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ItemCardComponent,
    ItemCardAddComponent,
    TranslateModule
  ]
})
export class ListComponent {
  @Input() tasksList: Task[] = [];

  constructor(
    private taskService: TaskService,
    private translate: TranslateService) {
      this.translate.setDefaultLang('es');
    }

  updateTaskList(updatedTasks: Task[]) {
    this.tasksList = updatedTasks; // Actualizar la lista con los datos recibidos
  }
}
