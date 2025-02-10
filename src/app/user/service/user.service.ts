import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: any;

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUserByName(name: string): Observable<any> {
    const url = `${this.apiUrl}?name=${name}`;
    return this.http.get(url);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  changeRole(user: any): Observable<any> {
    const nextRole = user.role === 'user' ? 'developer' : user.role === 'developer' ? 'admin' : 'user';
    const updatedUser = { ...user, role: nextRole };

    return this.http.patch(`${this.apiUrl}/${user.id}`, { role: nextRole });
  }

}
