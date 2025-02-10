import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprint } from '../models/sprint.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  sprints: any;

  private apiUrl = 'http://localhost:3000/sprints';

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  getSprints(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una tarea por id
  getSprintById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva tarea
  createSprint(sprint: any): Observable<any> {
    return this.http.post(this.apiUrl, sprint);
  }

  // Actualizar una tarea
  updateSprint(id: string, sprint: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sprint);
  }

  updateSprint2(sprint: Sprint): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.apiUrl}/${sprint.id}`, sprint);
  }

  // Eliminar una tarea
  deleteSprint(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
