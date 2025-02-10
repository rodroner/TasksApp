import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponent } from './category.component';

import { CategoryService } from './services/category.service';
import { TaskService } from '../task/service/task.service';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', [
      'getCategories',
      'createCategory',
      'deleteCategory',
      'updateCategory'
    ]);

    mockTaskService = jasmine.createSpyObj('TaskService', ['removeCategoryFromTasks']);

    mockCategoryService.getCategories.and.returnValue(of([]));
    mockCategoryService.createCategory.and.returnValue(of({}));
    mockCategoryService.deleteCategory.and.returnValue(of({}));
    mockCategoryService.updateCategory.and.returnValue(of({}));

    mockTaskService.removeCategoryFromTasks.and.returnValue(of()); // Observable válido para las pruebas

    await TestBed.configureTestingModule({
      imports: [
        CategoryComponent,
        FormsModule,
        HttpClientTestingModule,
        MatButtonToggleModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
      ],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call refreshCatList on ngOnInit', () => {
    spyOn(component, 'refreshCatList');
    component.ngOnInit();
    expect(component.refreshCatList).toHaveBeenCalled();
  });

  it('should fetch categories on refreshCatList', () => {
    const mockCategories = [{ id: '1', name: 'Test Category' }];
    mockCategoryService.getCategories.and.returnValue(of(mockCategories));

    component.refreshCatList();

    expect(mockCategoryService.getCategories).toHaveBeenCalled();
    expect(component.categoryList).toEqual(mockCategories);
  });

  it('should create a new category on onSubmit', () => {
    const mockCategory = { name: 'New Category' };
    component.cat = mockCategory;

    mockCategoryService.createCategory.and.returnValue(of({}));

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    }));


    component.onSubmit();

    expect(mockCategoryService.createCategory).toHaveBeenCalledWith(mockCategory);
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should delete a category on deleteCategory', async () => {
    const categoryId = '1';

    mockTaskService.removeCategoryFromTasks.and.returnValue(of(undefined));
    mockCategoryService.deleteCategory.and.returnValue(of({}));

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    }));

    await component.deleteCategory(categoryId);
    expect(mockTaskService.removeCategoryFromTasks).toHaveBeenCalledWith(categoryId);
    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(categoryId);
  });



  it('should update a category on updateCategory', () => {
    const categoryId = '123';
    const updatedCategory = { name: 'Updated Category' };
    component.cat = updatedCategory;

    mockCategoryService.updateCategory.and.returnValue(of({}));

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    }));


    component.updateCategory(categoryId);

    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(categoryId, updatedCategory);
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should show and hide modals correctly', () => {
    component.showFormModal();
    expect(component.showModal).toBeTrue();

    component.hiddeModal();
    expect(component.showModal).toBeFalse();

    component.showFormModalUpdate('123', 'Test Category');
    expect(component.showModalUpdate).toBeTrue();
    expect(component.idCatAux).toEqual('123');
    expect(component.cat.name).toEqual('Test Category');

    component.hiddeModalUpdate();
    expect(component.showModalUpdate).toBeFalse();
    expect(component.cat.name).toEqual('');
  });
});
