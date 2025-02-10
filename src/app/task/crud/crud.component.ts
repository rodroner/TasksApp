import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SearcherComponent } from './searcher/searcher.component';
import { ListComponent } from './list/list.component';

import { TaskService } from '../service/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    SearcherComponent,
    ListComponent,
  ]
})
export class CrudComponent {

  tasksList: Task[] = [];
  tasksListShow: Task[] = [];

  //loader
  loading: boolean = false;
  //alerts
  alertCreate = false;

  constructor(private taskService: TaskService) { }

  getListFilter(taskFiltered: Task[]){
    this.tasksListShow = taskFiltered;
  }

  ngOnInit(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.tasksList = data;
      this.tasksListShow = this.tasksList;
      this.loading = false;

    });
  }

  onFilteredTasks(filteredTasks: Task[]): void {
    this.tasksListShow = filteredTasks;
  }
}
