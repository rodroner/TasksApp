import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonRemoveComponent } from './button-remove.component';
import { TaskService } from '../../../service/task.service';
import { of, throwError } from 'rxjs';
import { Task } from '../../../models/task.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TASK -> ITEM-CARD -> ButtonRemoveComponent', () => {
  let component: ButtonRemoveComponent;
  let fixture: ComponentFixture<ButtonRemoveComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks', 'deleteTask']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        ButtonRemoveComponent,
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initial setup', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize showModal to false', () => {
      expect(component.showModal).toBeFalse();
    });
  });

  describe('Modal behavior', () => {
    it('should set showModal to true and currentTask when showFormModal is called', () => {
      const task: Task = {
        id: '1',
        name: 'Task 1',
        assigned: '1',
        hasCategory: '1',
        hasSprint: '1',
        hasTaskChild: [],
        difficulty: 0,
        process: 'done',
      };

      component.task = task;
      component.showFormModal(task.id);

      expect(component.showModal).toBeTrue();
      expect(component.currentTask).toEqual(task);
    });

    it('should set showModal to false when hiddeModal is called', () => {
      component.hiddeModal();
      expect(component.showModal).toBeFalse();
    });
  });

  describe('Task removal', () => {
    it('should call deleteTask and emit updated task list on successful deletion', () => {
      const task: Task = {
        id: '1',
        name: 'Task 1',
        assigned: '1',
        hasCategory: '1',
        hasSprint: '1',
        hasTaskChild: [],
        difficulty: 0,
        process: 'done',
      };

      component.currentTask = task;
      taskServiceMock.deleteTask.and.returnValue(of({}));

      const emitSpy = spyOn(component.taskRemove, 'emit');
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as SweetAlertResult));


      component.removePermanent();

      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(task.id);
      expect(emitSpy).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Tarea eliminada',
          text: `La tarea "${task.name}" ha sido eliminada exitosamente.`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: jasmine.objectContaining({
            popup: 'alert alert-danger',
            confirmButton: 'btn btn-primary'
          }),
          timer: 2000,
          timerProgressBar: true,
        })
      );
    });

    it('should show an error alert when deleteTask fails', () => {
      const task: Task = {
        id: '1',
        name: 'Task 1',
        assigned: '1',
        hasCategory: '1',
        hasSprint: '1',
        hasTaskChild: [],
        difficulty: 0,
        process: 'pending selection'
      } as Task;

      component.currentTask = task;
      taskServiceMock.deleteTask.and.returnValue(throwError('Error'));

      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as SweetAlertResult));

      component.removePermanent();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'No se pudo eliminar la tarea. Intente de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
      );

    });
  });

  describe('refreshTaskList', () => {
    it('should emit updated task list when refreshTaskList is called', () => {
      const tasks: Task[] = [
        {
          id: '1',
          name: 'Task 1',
          assigned: '1',
          hasCategory: '1',
          hasSprint: '1',
          hasTaskChild: [],
          difficulty: 0,
          process: 'pending selection'
        }
      ];
      taskServiceMock.getTasks.and.returnValue(of(tasks));

      const emitSpy = spyOn(component.taskRemove, 'emit');

      component.refreshTaskList();

      expect(emitSpy).toHaveBeenCalledWith(tasks);
    });
  });
});
