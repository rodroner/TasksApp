import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { TaskService } from '../service/task.service';
import { Task } from '../models/task.model';
import { of } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ItemCardComponent } from '../crud/item-card/item-card.component';
import { CommonModule } from '@angular/common';

/*
describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks', 'getTaskById', 'updateTask2']);

    await TestBed.configureTestingModule({
      declarations: [BoardComponent, ItemCardComponent],
      imports: [CommonModule, DragDropModule],
      providers: [
        { provide: TaskService, useValue: taskServiceMock }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the board component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tasks by status on ngOnInit', () => {
    const mockTasks: Task[] = [
      { id: '1', name: 'Task 1', process: 'pending selection' } as Task,
      { id: '2', name: 'Task 2', process: 'in progress' } as Task,
      { id: '3', name: 'Task 3', process: 'done' } as Task,
    ];

    taskServiceMock.getTasks.and.returnValue(of(mockTasks));

    component.ngOnInit();

    expect(component.tasksByStatus['pending selection'].length).toBe(1);
    expect(component.tasksByStatus['in progress'].length).toBe(1);
    expect(component.tasksByStatus['done'].length).toBe(1);
  });

  describe('drop', () => {
    it('should handle item drop within the same column', () => {
      const mockTask: Task = { id: '1', name: 'Task 1', process: 'pending selection' } as Task;

      const mockEvent: any = {
        previousContainer: { data: [mockTask] },
        container: { data: [mockTask] },
        previousIndex: 0,
        currentIndex: 0
      };

      spyOn(component, 'drop').and.callThrough();
      component.drop(mockEvent);

      expect(component.drop).toHaveBeenCalledWith(mockEvent);
      // Verificamos si se movió correctamente dentro de la misma columna
      expect(mockEvent.container.data.length).toBe(1);
    });

    it('should handle item drop across columns and update task process', () => {
      const mockTask: Task = { id: '1', name: 'Task 1', process: 'pending selection' } as Task;

      const mockEvent: any = {
        previousContainer: { data: [mockTask] },
        container: { data: [] },
        previousIndex: 0,
        currentIndex: 0
      };

      const updatedTask: Task = { ...mockTask, process: 'in progress' };

      spyOn(component, 'drop').and.callThrough();
      taskServiceMock.getTaskById.and.returnValue(of(mockTask));
      taskServiceMock.updateTask2.and.returnValue(of(updatedTask));

      component.drop(mockEvent);

      expect(component.drop).toHaveBeenCalledWith(mockEvent);
      expect(taskServiceMock.getTaskById).toHaveBeenCalledWith(mockTask.id);
      expect(taskServiceMock.updateTask2).toHaveBeenCalledWith(updatedTask);
      expect(mockEvent.container.data.length).toBe(1);
    });
  });

});
*/
