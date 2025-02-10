import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks: any;

  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) { }

  // Obtener todas las tareas
  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una tarea por id
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva tarea
  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  // Actualizar una tarea
  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  updateTask2(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  // Eliminar una tarea
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar el estado de una tarea
  updateTaskProcess(taskId: string, newProcess: Task['process']) {
    const tasks = this.tasksSubject.value.map(task =>
      task.id === taskId ? { ...task, process: newProcess } : task
    );
    this.tasksSubject.next(tasks);
  }


  // Método para borrar la categoría de las tareas asociadas
  removeCategoryFromTasks(categoryId: string) {
    return this.http.get<Task[]>(`${this.apiUrl}?hasCategory=${categoryId}`).pipe(
      switchMap((tasks) => {
        if (tasks.length === 0) {
          return of(undefined);
        }

        const updateRequests = tasks.map((task) => {
          const updatedTask = { ...task, hasCategory: null };
          return this.http.put(`${this.apiUrl}/${task.id}`, updatedTask);
        });

        return forkJoin(updateRequests);
      }),
      map(() => undefined)
    );
  }

  // Método para borrar el user de las tareas asociadas
  removeUserFromTasks(userId: string): Observable<void> {
    return this.http.get<Task[]>(`${this.apiUrl}?assigned=${userId}`).pipe(
      switchMap((tasks) => {
        if (tasks.length === 0) {
          return of(undefined);
        }

        const updateRequests = tasks.map((task) => {
          const updatedTask = { ...task, assigned: null };
          return this.http.put(`${this.apiUrl}/${task.id}`, updatedTask);
        });

        return forkJoin(updateRequests);
      }),
      map(() => undefined)
    );
  }

  // Método para borrar el user de las tareas asociadas
  removeSprintFromTasks(sprintId: string): Observable<void> {
    return this.http.get<Task[]>(`${this.apiUrl}?hasSprint=${sprintId}`).pipe(
      switchMap((tasks) => {
        if (tasks.length === 0) {
          return of(undefined);
        }

        const updateRequests = tasks.map((task) => {
          const updatedTask = { ...task, hasSprint: null };
          return this.http.put(`${this.apiUrl}/${task.id}`, updatedTask);
        });

        return forkJoin(updateRequests);
      }),
      map(() => undefined)
    );
  }

  changeProcess(task: any): Observable<any> {
    const nextProcess = task.process === 'pending selection' ? 'in progress' :
                        task.process === 'in progress' ? 'pending validation' :
                        task.process === 'pending validation' ? 'done' : 'pending selection';

    return this.http.patch(`${this.apiUrl}/${task.id}`, { process: nextProcess });
  }

}
