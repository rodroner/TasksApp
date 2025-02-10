import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: any;

  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una tarea por id
  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva tarea
  createCategory(cat: any): Observable<any> {
    return this.http.post(this.apiUrl, cat);
  }

  // Actualizar una tarea
  updateCategory(id: string, cat: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cat);
  }

  updateCategory2(cat: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${cat.id}`, cat);
  }

  // Eliminar una tarea
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
