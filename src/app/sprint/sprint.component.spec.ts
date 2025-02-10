import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { SprintComponent } from './sprint.component';
import { SprintService } from './services/sprint.service';
import { TaskService } from '../task/service/task.service';

import { Sprint } from './models/sprint.model';
import { Task } from '../task/models/task.model';

describe('SprintComponent', () => {
  let component: SprintComponent;
  let fixture: ComponentFixture<SprintComponent>;
  let sprintServiceMock: jasmine.SpyObj<SprintService>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    sprintServiceMock = jasmine.createSpyObj('SprintService', ['getSprints', 'createSprint', 'deleteSprint', 'updateSprint']);
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks', 'removeSprintFromTasks']);

    sprintServiceMock.getSprints.and.returnValue(of([{ id: '1', name: 'Sprint 1' } as Sprint]));
    sprintServiceMock.createSprint.and.returnValue(of({ id: '2', name: 'New Sprint' } as Sprint));
    sprintServiceMock.deleteSprint.and.returnValue(of(null));
    sprintServiceMock.updateSprint.and.returnValue(of({ id: '1', name: 'Updated Sprint' } as Sprint));

    taskServiceMock.getTasks.and.returnValue(of([{ id: '1', name: 'Task 1', hasSprint: '1' } as Task]));
    taskServiceMock.removeSprintFromTasks.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [SprintComponent],
      providers: [
        { provide: SprintService, useValue: sprintServiceMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh sprint list on initialization', () => {
    component.ngOnInit();

    expect(sprintServiceMock.getSprints).toHaveBeenCalled();
    expect(component.sprintList).toEqual([{ id: '1', name: 'Sprint 1' } as Sprint]);
  });

  it('should load tasks in sprints on initialization', () => {
    component.ngOnInit();

    expect(taskServiceMock.getTasks).toHaveBeenCalled();
    expect(component.taskInSprints).toEqual([{ id: '1', name: 'Task 1', hasSprint: '1' } as Task]);
  });

  it('should return tasks associated with a sprint', () => {
    component.taskInSprints = [
      { id: '1', name: 'Task 1', hasSprint: '1' } as Task,
      { id: '2', name: 'Task 2', hasSprint: '2' } as Task,
    ];

    const tasksForSprint = component.getTasksForSprint('1');
    expect(tasksForSprint).toEqual([{ id: '1', name: 'Task 1', hasSprint: '1' } as Task]);
  });

  it('should create a sprint and refresh list on submit', () => {
    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true } as SweetAlertResult));

    component.sprint = { name: 'New Sprint' };
    component.onSubmit();

    expect(sprintServiceMock.createSprint).toHaveBeenCalledWith({ name: 'New Sprint' });
    expect(Swal.fire).toHaveBeenCalled();
    expect(component.showModal).toBeFalse();
    expect(sprintServiceMock.getSprints).toHaveBeenCalled();
  });

  it('should delete a sprint and refresh list', () => {
    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true } as SweetAlertResult));

    component.deleteSprint('1');

    expect(taskServiceMock.removeSprintFromTasks).toHaveBeenCalledWith('1');
    expect(sprintServiceMock.deleteSprint).toHaveBeenCalledWith('1');
    expect(Swal.fire).toHaveBeenCalled();
    expect(sprintServiceMock.getSprints).toHaveBeenCalled();
  });

  it('should handle error when deleting a sprint fails', () => {
    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true } as SweetAlertResult));
    sprintServiceMock.deleteSprint.and.returnValue(throwError(() => new Error('Delete failed')));

    component.deleteSprint('1');

    expect(sprintServiceMock.deleteSprint).toHaveBeenCalledWith('1');
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'Error', text: 'No se pudo eliminar el sprint. Intenta nuevamente.' })
    );
  });

  it('should update a sprint and refresh list', () => {
    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true } as SweetAlertResult));

    component.sprint = { name: 'Updated Sprint' };
    component.updateSprint('1');

    expect(sprintServiceMock.updateSprint).toHaveBeenCalledWith('1', { name: 'Updated Sprint' });
    expect(Swal.fire).toHaveBeenCalled();
    expect(component.showModalUpdate).toBeFalse();
    expect(sprintServiceMock.getSprints).toHaveBeenCalled();
  });

  it('should show the create sprint modal', () => {
    component.showFormModal();
    expect(component.showModal).toBeTrue();
  });

  it('should hide the create sprint modal', () => {
    component.hiddeModal();
    expect(component.showModal).toBeFalse();
  });

  it('should show the update sprint modal with prefilled data', () => {
    component.showFormModalUpdate('1', 'Sprint 1');

    expect(component.showModalUpdate).toBeTrue();
    expect(component.idSprintAux).toBe('1');
    expect(component.sprint).toEqual({ name: 'Sprint 1' });
  });

  it('should hide the update sprint modal and reset sprint data', () => {
    component.hiddeModalUpdate();

    expect(component.showModalUpdate).toBeFalse();
    expect(component.sprint).toEqual({ name: '' });
  });
});
