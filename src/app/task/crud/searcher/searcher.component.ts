import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Task } from '../../models/task.model';
import { UserService } from '../../../user/service/user.service';
import { CategoryService } from '../../../category/services/category.service';
import { SprintService } from '../../../sprint/services/sprint.service';
import { Sprint } from '../../../sprint/models/sprint.model';
import { Category } from '../../../category/models/category.model';
import { User } from '../../../user/models/user.model';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrl: './searcher.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule
  ]
})
export class SearcherComponent implements OnInit {

  valueNameInput = '';

  @Input() tasksList: Task[] = [];

  @Output() filteredTasks: EventEmitter<any> = new EventEmitter<any>();

  filterForm: any;

  sprintList: Sprint[] = [];

  categoryList: Category[] = [];

  usersList: User[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private catService: CategoryService,
    private sprintService: SprintService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    // Inicializa el formulario
    this.filterForm = this.fb.group({
      name: [''],
      assigned: [''],
      hasCategory: [''],
      hasSprint: [''],
      difficulty: [null],
      process: ['']
    });

    // Suscripción a los cambios del formulario
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters(this.tasksList);
    });

    this.sprintService.getSprints().subscribe((data: Sprint[]) => {
      this.sprintList = data;
    });

    this.catService.getCategories().subscribe((data: Category[]) => {
      this.categoryList = data;
    });

    this.userService.getUsers().subscribe((data: User[]) => {
      this.usersList = data;
    });
  }

  getList() {
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.tasksList = data;
    });
    this.filteredTasks.emit(this.tasksList);
  }

  applyFilters(tasks: any[]): void {
    this.getList();

    if (this.filterForm) {
      const filters = this.filterForm.value;
      let filteredTasks = this.tasksList;

      console.log('applyFilters');
      console.log('name ' + filters.name + ".");
      console.log('assigned ' + filters.assigned + ".");
      console.log('hasCategory ' + filters.hasCategory + ".");
      console.log('hasSprint ' + filters.hasSprint + ".");
      console.log('difficulty ' + filters.difficulty + ".");
      console.log('process ' + filters.process + ".");

      //reset
      if (
        (filters.name == null) &&
        (filters.assigned == null) &&
        (filters.hasCategory == null) &&
        (filters.hasSprint == null) &&
        (filters.difficulty == null) &&
        (filters.process == null)
      ) {
        console.log('reset');
        this.getList();

      }

      if (filters.name != "" && filters.name != null) {
        filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(filters.name.toLowerCase()));
      }
      if (filters.assigned != "" && filters.assigned != null) {
        filteredTasks = filteredTasks.filter(task => task.assigned === filters.assigned);
      }
      if (filters.hasCategory != "" && filters.hasCategory != null) {
        filteredTasks = filteredTasks.filter(task => task.hasCategory === filters.hasCategory);
      }
      if (filters.hasSprint != "" && filters.hasSprint != null) {
        filteredTasks = filteredTasks.filter(task => task.hasSprint === filters.hasSprint);
      }
      if (filters.difficulty != null) {
        filteredTasks = filteredTasks.filter(task => task.difficulty >= filters.difficulty);
      }
      if (filters.process != "" && filters.process != null) {
        filteredTasks = filteredTasks.filter(task => task.process === filters.process);
      }
      console.log('filteredTasks');
      console.log(filteredTasks);

      this.filteredTasks.emit(filteredTasks);
    }
  }

}
