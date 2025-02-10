import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let dummyTasks: Task[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    dummyTasks = [
      {
        id: '1',
        name: 'Task 1',
        assigned: '1',
        hasCategory: '1',
        hasSprint: '1',
        hasTaskChild: [],
        difficulty: 0,
        process: 'pending selection'
      } as Task,
      {
        id: '2',
        name: 'Task 2',
        assigned: '2',
        hasCategory: '2',
        hasSprint: '2',
        hasTaskChild: [],
        difficulty: 0,
        process: 'pending selection'
      } as Task
    ];
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test para obtener todas las tareas
  it('should retrieve all tasks from the API via GET', () => {
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  // Test para obtener una tarea por id
  it('should retrieve a task by id from the API via GET', () => {
    const taskId = '1';
    service.getTaskById(taskId).subscribe(task => {
      expect(task).toEqual(dummyTasks[0]);
    });

    const req = httpMock.expectOne(`http://localhost:3000/tasks/${taskId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks[0]);
  });

  // Test para crear una tarea
  it('should create a new task via POST', () => {
    const newTask = {
      id: '3',
      name: 'Task 3',
      assigned: '3',
      hasCategory: '3',
      hasSprint: '3',
      hasTaskChild: [],
      difficulty: 0,
      process: 'pending selection'
    } as Task

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('POST');
    req.flush(newTask);
  });

  // Test para actualizar una tarea
  it('should update an existing task via PUT', () => {
    const updatedTask = {
      id: '1',
      name: 'Task 1',
      assigned: '1',
      hasCategory: '1',
      hasSprint: '1',
      hasTaskChild: [],
      difficulty: 0,
      process: 'done',
    } as Task;

    service.updateTask2(updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`http://localhost:3000/tasks/${updatedTask.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);
  });

  // Test para eliminar una tarea
  it('should delete a task via DELETE', () => {
    const taskId = '1';

    service.deleteTask(taskId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update the process of a task', (done) => {
    const taskId = '1';
    const newProcess = 'in progress';

    service.updateTaskProcess(taskId, newProcess);

    service['tasksSubject'].subscribe(tasks => {
      const updatedTask = tasks.find(task => task.id === taskId);
      expect(updatedTask?.process).toBe(newProcess);
      done();
    });
  });




  it('should remove category from tasks', () => {
    const categoryId = '1';

    service.removeCategoryFromTasks(categoryId).subscribe(() => {
      expect(true).toBeTrue();
    });

    const reqGet = httpMock.expectOne(`http://localhost:3000/tasks?hasCategory=${categoryId}`);
    expect(reqGet.request.method).toBe('GET');
    reqGet.flush([dummyTasks[0]]);

    dummyTasks.forEach(task => {
      const reqPut = httpMock.expectOne(`http://localhost:3000/tasks/${task.id}`);
      expect(reqPut.request.method).toBe('PUT');
      reqPut.flush({ ...task, hasCategory: null });
    });

    httpMock.verify();
  });


  it('should remove user from tasks', () => {
    const userId = '1';

    service.removeUserFromTasks(userId).subscribe(() => {
      expect(true).toBeTrue();
    });

    const reqGet = httpMock.expectOne(`http://localhost:3000/tasks?assigned=${userId}`);
    expect(reqGet.request.method).toBe('GET');
    reqGet.flush([dummyTasks[0]]);

    dummyTasks.forEach(task => {
      const reqPut = httpMock.expectOne(`http://localhost:3000/tasks/${task.id}`);
      expect(reqPut.request.method).toBe('PUT');
      reqPut.flush({ ...task, assigned: null });
    });

    httpMock.verify();
  });


  it('should remove sprint from tasks', () => {
    const sprintId = '1';

    service.removeSprintFromTasks(sprintId).subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(`http://localhost:3000/tasks?hasSprint=${sprintId}`);
    expect(req.request.method).toBe('GET');
    req.flush([dummyTasks[0]]);
  });

  it('should update an existing task via PUT', () => {
    const updatedTask = {
      id: '1',
      name: 'Updated Task 1',
      assigned: '1',
      hasCategory: '1',
      hasSprint: '1',
      hasTaskChild: [],
      difficulty: 0,
      process: 'done'
    };

    service.updateTask(updatedTask.id, updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${updatedTask.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });

  it('should change the process of a task via PATCH', () => {
    const task = {
      id: '1',
      name: 'Task 1',
      assigned: '1',
      hasCategory: '1',
      hasSprint: '1',
      hasTaskChild: [],
      difficulty: 0,
      process: 'pending selection'
    };

    const updatedTask = { ...task, process: 'in progress' };
    service.changeProcess(task).subscribe(updatedTaskResponse => {
      expect(updatedTaskResponse).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${task.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ process: 'in progress' });
    req.flush(updatedTask);
  });



});
