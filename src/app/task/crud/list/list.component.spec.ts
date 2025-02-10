import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importar para simular las peticiones HTTP
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { Task } from '../../models/task.model';

import { TaskService } from '../../service/task.service';

import { ListComponent } from './list.component';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ItemCardAddComponent } from '../item-card-add/item-card-add.component';

/*
describe('TASK > ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks']);
    taskServiceMock.getTasks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        ListComponent,
        ItemCardComponent,
        ItemCardAddComponent,
        CommonModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the list component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct initial tasks list', () => {
    const mockTasks: Task[] = [
      { id: '1', name: 'Task 1' } as Task,
      { id: '2', name: 'Task 2' } as Task
    ];

    component.tasksList = mockTasks;

    expect(component.tasksList.length).toBe(2);
    expect(component.tasksList[0].name).toBe('Task 1');
  });

  describe('updateTaskList', () => {
    it('should update the tasks list when updateTaskList is called', () => {
      const initialTasks: Task[] = [
        { id: '1', name: 'Task 1' } as Task,
      ];

      const updatedTasks: Task[] = [
        { id: '1', name: 'Updated Task 1'} as Task,
        { id: '2', name: 'Task 2' } as Task
      ];

      component.tasksList = initialTasks;

      component.updateTaskList(updatedTasks);

      expect(component.tasksList.length).toBe(2);
      expect(component.tasksList[0].name).toBe('Updated Task 1');
      expect(component.tasksList[1].name).toBe('Task 2');
    });
  });
});
*/
