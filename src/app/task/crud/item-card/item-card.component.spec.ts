import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { Task } from '../../models/task.model';
import { User } from '../../../user/models/user.model';
import { Category } from '../../../category/models/category.model';

import { TaskService } from '../../service/task.service';
import { UserService } from '../../../user/service/user.service';
import { CategoryService } from '../../../category/services/category.service';
import { SprintService } from '../../../sprint/services/sprint.service';

import { ButtonEditComponent } from './button-edit/button-edit.component';
import { ButtonRemoveComponent } from './button-remove/button-remove.component';
import { ButtonViewComponent } from './button-view/button-view.component';
import { ItemCardComponent } from './item-card.component';

describe('TASK > ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let catServiceMock: jasmine.SpyObj<CategoryService>;
  let sprintServiceMock: jasmine.SpyObj<SprintService>;

  beforeEach(async () => {
    // Mocks de servicios
    taskServiceMock = jasmine.createSpyObj('TaskService', [
      'getTaskById',
      'getTasks',
      'updateTask2',
    ]);
    userServiceMock = jasmine.createSpyObj('UserService', ['getUserById', 'getUsers']);
    catServiceMock = jasmine.createSpyObj('CategoryService', ['getCategoryById', 'getCategories']);
    sprintServiceMock = jasmine.createSpyObj('SprintService', ['getSprintById']);

    // Configurar los mocks de los servicios
    taskServiceMock.updateTask2.and.returnValue(of({ id: '1', assigned: '1' } as Task));
    taskServiceMock.getTaskById.and.returnValue(of({ name: '1' }));
    userServiceMock.getUserById.and.returnValue(of({ name: '1' }));
    catServiceMock.getCategoryById.and.returnValue(of({ name: '1' }));
    sprintServiceMock.getSprintById.and.returnValue(of({ name: '1' }));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ItemCardComponent,
        ButtonEditComponent,
        ButtonRemoveComponent,
        ButtonViewComponent,
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: CategoryService, useValue: catServiceMock },
        { provide: SprintService, useValue: sprintServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    component.task = { id: '1', name: 'Task 1' } as Task;
    fixture.detectChanges();
  });

  it('should create the ItemCard component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize assignedUser, assignedCat, and assignedSprint when task has values', () => {
    const mockTask: Task = {
      id: '1',
      name: 'Task 1',
      assigned: '1',
      hasCategory: '1',
      hasSprint: '1'
    } as Task;

    component.task = mockTask;
    component.ngOnInit();

    expect(userServiceMock.getUserById).toHaveBeenCalledWith('1');
    expect(catServiceMock.getCategoryById).toHaveBeenCalledWith('1');
    expect(sprintServiceMock.getSprintById).toHaveBeenCalledWith('1');

    expect(component.assignedUser).toBe('1');
    expect(component.assignedCat).toBe('1');
    expect(component.assignedSprint).toBe('1');
  });

  it('should update category and emit taskRemove and taskUpdate events', () => {
    const mockTask: Task = { id: '1', name: 'Task Name' } as Task;
    const mockTasksList: Task[] = [mockTask];

    component.task = mockTask;
    component.tasksList = mockTasksList;

    spyOn(component.taskRemove, 'emit');
    spyOn(component.taskUpdate, 'emit');

    taskServiceMock.updateTask2.and.returnValue(of(mockTask));
    taskServiceMock.getTasks.and.returnValue(of(mockTasksList));

    const event = { target: { value: '1' } };
    component.onCatSelect(event as unknown as Event);

    fixture.detectChanges();

    expect(taskServiceMock.updateTask2).toHaveBeenCalledWith(mockTask);
    expect(component.taskRemove.emit).toHaveBeenCalledWith(mockTasksList);
    expect(component.taskUpdate.emit).toHaveBeenCalledWith(mockTasksList);
  });


  it('should update user and emit taskRemove and taskUpdate events', () => {
    const mockTask: Task = { id: '1', name: 'Task 1', assigned: '1' } as Task;
    const mockTasksList: Task[] = [mockTask];

    component.task = mockTask;

    spyOn(component.taskRemove, 'emit');
    spyOn(component.taskUpdate, 'emit');

    taskServiceMock.updateTask2.and.returnValue(of(mockTask));
    taskServiceMock.getTasks.and.returnValue(of(mockTasksList));

    const selectEvent = { target: { value: '1' } };
    component.onUserSelect(selectEvent as unknown as Event);

    fixture.detectChanges();

    expect(taskServiceMock.updateTask2).toHaveBeenCalledWith(mockTask);
    expect(component.taskRemove.emit).toHaveBeenCalledWith(mockTasksList);
    expect(component.taskUpdate.emit).toHaveBeenCalledWith(mockTasksList);
  });




  it('should handle the show category list and update categoryList', () => {
    const mockCategories: Category[] = [{ id: '1', name: '1' }];
    catServiceMock.getCategories.and.returnValue(of(mockCategories));

    component.showCatList();
    fixture.detectChanges();

    expect(component.categoryList).toEqual(mockCategories);
    expect(component.divSelectCatList).toBeTrue();
    expect(component.btnSelectCatList).toBeFalse();
  });

  it('should clear assigned user and refresh task list when "empty" is selected', () => {
    const mockTask: Task = { id: '1', name: 'Task 1', assigned: '1' } as Task;
    const mockTasksList: Task[] = [mockTask];

    component.task = mockTask;

    spyOn(component.taskRemove, 'emit');
    spyOn(component.taskUpdate, 'emit');

    taskServiceMock.updateTask2.and.returnValue(of(mockTask));
    taskServiceMock.getTasks.and.returnValue(of(mockTasksList));

    const selectEvent = { target: { value: 'empty' } };
    component.onUserSelect(selectEvent as unknown as Event);

    fixture.detectChanges();

    expect(component.task.assigned).toBe('');
    expect(taskServiceMock.updateTask2).toHaveBeenCalledWith(mockTask);
    expect(component.taskRemove.emit).toHaveBeenCalledWith(mockTasksList);
    expect(component.taskUpdate.emit).toHaveBeenCalledWith(mockTasksList);
  });

  it('should clear category and refresh task list when "empty" is selected', () => {
    const mockTask: Task = { id: '1', name: 'Task Name', hasCategory: '1' } as Task;
    const mockTasksList: Task[] = [mockTask];

    component.task = mockTask;

    spyOn(component.taskRemove, 'emit');
    spyOn(component.taskUpdate, 'emit');

    taskServiceMock.updateTask2.and.returnValue(of(mockTask));
    taskServiceMock.getTasks.and.returnValue(of(mockTasksList));

    const event = { target: { value: 'empty' } };
    component.onCatSelect(event as unknown as Event);

    fixture.detectChanges();

    expect(component.task.hasCategory).toBe('');
    expect(taskServiceMock.updateTask2).toHaveBeenCalledWith(mockTask);
    expect(component.taskRemove.emit).toHaveBeenCalledWith(mockTasksList);
    expect(component.taskUpdate.emit).toHaveBeenCalledWith(mockTasksList);
  });

  it('should change task process and emit processChanged event', () => {
    const mockTask: Task = { id: '1', name: 'Task 1', process: 'pending selection' } as Task;

    component.task = mockTask;

    spyOn(component.processChanged, 'emit');
    taskServiceMock.changeProcess.and.returnValue(of(mockTask));

    component.changeProcess(mockTask);

    expect(taskServiceMock.changeProcess).toHaveBeenCalledWith(mockTask);
    expect(component.task.process).toBe('in progress');
    expect(component.processChanged.emit).toHaveBeenCalledWith(mockTask);
  });

  it('should handle error when updating user fails', () => {
    const mockTask: Task = { id: '1', name: 'Task 1', assigned: '1' } as Task;

    component.task = mockTask;

    spyOn(console, 'error');

    taskServiceMock.updateTask2.and.returnValue(throwError(() => new Error('Error updating task')));

    const event = { target: { value: '1' } };
    component.onUserSelect(event as unknown as Event);

    expect(console.error).toHaveBeenCalledWith('Error al actualizar la tarea:', jasmine.any(Error));
  });


  it('should load user list and show the select user list', () => {
    const mockUsers: User[] = [{ id: '1', name: 'User 1' } as User];
    userServiceMock.getUsers.and.returnValue(of(mockUsers));

    component.showUserList();
    fixture.detectChanges();

    expect(component.userList).toEqual(mockUsers);
    expect(component.divSelectUserList).toBeTrue();
    expect(component.btnSelectUserList).toBeFalse();
  });







});
