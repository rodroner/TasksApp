import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { TaskService } from '../../../service/task.service';
import { Task } from '../../../models/task.model';
import { ButtonEditComponent } from './button-edit.component';

class MockTaskService {
  updateTask2(task: Task) {
    return of(task);
  }

  getTasks() {
    return of([]);
  }
}

describe('TASK -> ITEM-CARD -> ButtonEditComponent', () => {
  let component: ButtonEditComponent;
  let fixture: ComponentFixture<ButtonEditComponent>;
  let mockTaskService: MockTaskService;

  beforeEach(async () => {
    mockTaskService = new MockTaskService();

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        ButtonEditComponent,  // ✅ Importado correctamente
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show the modal when showFormModalUpdate is called', () => {
    const task = { id: '1', name: 'Test' } as Task;
    component.task = task;

    component.showFormModalUpdate('1');
    expect(component.showModal).toBeTrue();
    expect(component.currentTask).toEqual({ ...task });
  });

  it('should restore task name in inputValid if task name is empty', () => {
    const task = { id: '1', name: '' } as Task;
    const currentTask = { id: '1', name: 'Restored Task' } as Task;

    component.task = task;
    component.currentTask = currentTask;

    component.inputValid();

    expect(component.task?.name).toBe('Restored Task');
  });

  it('should update task and call Swal on updateValid', () => {
    const task = { id: '1', name: 'Test Task' } as Task;

    component.task = task;

    spyOn(mockTaskService, 'updateTask2').and.returnValue(of(task));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as SweetAlertResult<any>));

    component.updateValid();

    expect(mockTaskService.updateTask2).toHaveBeenCalledWith(component.task);

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Tarea actualizada',
        text: `La tarea "${task.name}" ha sido actualizada exitosamente.`,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'alert alert-primary',
          confirmButton: 'btn btn-primary'
        },
        timer: 2000,
        timerProgressBar: true,
      })
    );
  });

  it('should hide the modal and restore task on hiddeModalUpdate', () => {
    const task = { id: '1', name: 'Test Task'} as Task;
    component.task = task;
    component.currentTask = { ...task };

    component.hiddeModalUpdate();

    expect(component.showModal).toBeFalse();
    expect(component.task?.name).toBe('Test Task');
  });
});
