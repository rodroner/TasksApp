import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Task } from '../../models/task.model';
import { TaskService } from '../../service/task.service';

import { Sprint } from '../../../sprint/models/sprint.model';
import { SprintService } from '../../../sprint/services/sprint.service';

import { Category } from '../../../category/models/category.model';
import { CategoryService } from '../../../category/services/category.service';

import { User } from '../../../user/models/user.model';
import { UserService } from '../../../user/service/user.service';

import { ItemCardAddComponent } from './item-card-add.component';
import Swal, { SweetAlertResult } from 'sweetalert2';

declare let $: any;

describe('TASK > ItemCardAddComponent', () => {
  let component: ItemCardAddComponent;
  let fixture: ComponentFixture<ItemCardAddComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let sprintServiceMock: jasmine.SpyObj<SprintService>;
  let categoryServiceMock: jasmine.SpyObj<CategoryService>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks', 'createTask']);
    sprintServiceMock = jasmine.createSpyObj('SprintService', ['getSprints']);
    categoryServiceMock = jasmine.createSpyObj('CategoryService', ['getCategories']);
    userServiceMock = jasmine.createSpyObj('UserService', ['getUsers']);

    taskServiceMock.getTasks.and.returnValue(of([{ id: '1', name: 'Task 1' } as Task]));
    taskServiceMock.createTask.and.returnValue(of({ id: '1', name: 'New Task' } as Task));
    sprintServiceMock.getSprints.and.returnValue(of([{ id: '1', name: 'Sprint 1' } as Sprint]));
    categoryServiceMock.getCategories.and.returnValue(of([{ id: '1', name: 'Category 1' } as Category]));
    userServiceMock.getUsers.and.returnValue(of([{ id: '1', name: 'User 1' } as User]));

    await TestBed.configureTestingModule({
      imports: [ItemCardAddComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: SprintService, useValue: sprintServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh task list and emit taskAdded', () => {
    spyOn(component.taskAdded, 'emit');

    component.refreshTaskList();

    expect(taskServiceMock.getTasks).toHaveBeenCalled();
    expect(component.taskAdded.emit).toHaveBeenCalledWith([{ id: '1', name: 'Task 1' } as Task]);
  });

  it('should set hoverDifficulty on mouse enter and reset on mouse leave', () => {
    component.onMouseEnter(3);
    expect(component.hoverDifficulty).toBe(3);

    component.onMouseLeave();
    expect(component.hoverDifficulty).toBe(0);
  });

  it('should select difficulty and update task difficulty', () => {
    component.selectDifficulty(5);
    expect(component.selectedDifficulty).toBe(5);
    expect(component.task.difficulty).toBe(5);
  });

  it('should add and remove child tasks on pickChildTask', () => {
    const eventAdd = { checked: true } as MatSlideToggleChange;
    const eventRemove = { checked: false } as MatSlideToggleChange;

    component.pickChildTask(eventAdd, 'childTaskId');
    expect(component.task.hasTaskChild).toContain('childTaskId');

    component.pickChildTask(eventRemove, 'childTaskId');
    expect(component.task.hasTaskChild).not.toContain('childTaskId');
  });

  /*
  it('should display epic task form when category is 0000', () => {
    spyOn($.fn, 'removeClass');
    spyOn($.fn, 'addClass');

    const eventEpic = { target: { value: '0000' } } as unknown as Event;
    const eventNonEpic = { target: { value: '1234' } } as unknown as Event;

    component.selectCategory(eventEpic);
    expect($.fn.removeClass).toHaveBeenCalledWith('d-none');

    component.selectCategory(eventNonEpic);
    expect($.fn.addClass).toHaveBeenCalledWith('d-none');
  });
  */

  /*
  it('should create a task and refresh task list on submit', () => {
    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true } as SweetAlertResult));

    component.task = { name: 'New Task'} as Task;
    component.onSubmit();

    expect(taskServiceMock.createTask).toHaveBeenCalledWith(component.task);
    expect(Swal.fire).toHaveBeenCalled();
    expect(component.showModal).toBeFalse();
    expect(taskServiceMock.getTasks).toHaveBeenCalled();
  });
  */

  it('should load data and show modal on showFormModal', () => {
    component.showFormModal();

    expect(sprintServiceMock.getSprints).toHaveBeenCalled();
    expect(categoryServiceMock.getCategories).toHaveBeenCalled();
    expect(taskServiceMock.getTasks).toHaveBeenCalled();
    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.showModal).toBeTrue();
  });

  it('should hide the modal on hiddeModal', () => {
    component.hiddeModal();
    expect(component.showModal).toBeFalse();
  });
});
