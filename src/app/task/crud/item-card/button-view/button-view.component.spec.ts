import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../../user/service/user.service';
import { CategoryService } from '../../../../category/services/category.service';
import { TaskService } from '../../../service/task.service';
import { ButtonViewComponent } from './button-view.component';
import { Task } from '../../../models/task.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TASK -> ITEM-CARD -> ButtonViewComponent', () => {
  let component: ButtonViewComponent;
  let fixture: ComponentFixture<ButtonViewComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    // Mocks para los servicios
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTaskById']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserById']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getCategoryById']);

    await TestBed.configureTestingModule({
      imports: [
        ButtonViewComponent
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: UserService, useValue: mockUserService },
        { provide: CategoryService, useValue: mockCategoryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();


  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize modal and fetch user, category, and task children on showFormModalView', () => {
    const mockTask = { id: '1', name: 'Test Task', hasTaskChild: ['task-2', 'task-3'] } as Task;
    component.task = mockTask;

    const mockUser = { id: '1', name: 'User Name' };
    const mockCategory = { id: 'cat-1', name: 'Category Name' };
    const mockTaskChild1 = { id: 'task-2', name: 'Child Task 1' } as Task;
    const mockTaskChild2 = { id: 'task-3', name: 'Child Task 2' } as Task;

    mockUserService.getUserById.and.returnValue(of(mockUser));
    mockCategoryService.getCategoryById.and.returnValue(of(mockCategory));
    mockTaskService.getTaskById.and.returnValues(of(mockTaskChild1), of(mockTaskChild2));

    spyOn(component, 'getUserAsigned').and.callThrough();
    spyOn(component, 'getCategory').and.callThrough();
    spyOn(component, 'getTaskChild').and.callThrough();

    component.showFormModalView();

    expect(component.showModal).toBeTrue();
    expect(component.getUserAsigned).toHaveBeenCalled();
    expect(component.getCategory).toHaveBeenCalled();
    expect(component.getTaskChild).toHaveBeenCalled();
    expect(component.assignedUser).toEqual('User Name');
    expect(component.assignedCat).toEqual('Category Name');
    expect(component.assignedTaskChild).toEqual([mockTaskChild1, mockTaskChild2]);
  });

  it('should hide modal and clear task children on hiddeModalView', () => {
    component.showModal = true;
    component.assignedTaskChild = [{ id: 'task-2', name: 'Child Task' } as Task];

    component.hiddeModalView();

    expect(component.showModal).toBeFalse();
    expect(component.assignedTaskChild).toEqual([]);
  });

  it('should handle error when fetching user in getUserAsigned', () => {
    const mockTask: Task = { id: '1', name: 'Test Task' } as Task;
    component.task = mockTask;
    mockUserService.getUserById.and.returnValue(throwError('Error fetching user'));

    spyOn(console, 'error');

    component.getUserAsigned();

    expect(console.error).toHaveBeenCalledWith('Error al encontrar el usuario', 'Error fetching user');
  });

  it('should handle error when fetching category in getCategory', () => {
    const mockTask: Task = { id: '1', name: 'Test Task', hasCategory: 'cat-1' } as Task;
    component.task = mockTask;
    mockCategoryService.getCategoryById.and.returnValue(throwError('Error fetching category'));

    spyOn(console, 'error');

    component.getCategory();

    expect(mockCategoryService.getCategoryById).toHaveBeenCalledWith('cat-1');
    expect(console.error).toHaveBeenCalledWith('Error al encontrar la categoría button-view', 'Error fetching category');
  });

  it('should handle error when fetching task children in getTaskChild', () => {
    const mockTask: Task = { id: '1', name: 'Test Task', hasTaskChild: ['task-2', 'task-3'] } as Task;
    component.task = mockTask;
    mockTaskService.getTaskById.and.returnValue(throwError('Error fetching task'));

    spyOn(console, 'error');

    component.getTaskChild();

    expect(console.error).toHaveBeenCalledWith('Error al encontrar getTaskChild button-view2', 'Error fetching task');
  });
});
