import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getUsers should return a list of users', () => {
    const mockUsers = [
      { id: 1, name: 'John', role: 'user' },
      { id: 2, name: 'Jane', role: 'admin' },
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('#getUserById should return a user by ID', () => {
    const mockUser = { id: 1, name: 'John', role: 'user' };

    service.getUserById('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('#getUserByName should return a user by name', () => {
    const mockUser = [{ id: 1, name: 'John', role: 'user' }];

    service.getUserByName('John').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}?name=John`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('#createUser should create a new user', () => {
    const newUser = { id: 3, name: 'Alice', role: 'user' };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(newUser);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(newUser);
  });

  it('#updateUser should update a user', () => {
    const updatedUser = { id: 1, name: 'John Updated', role: 'admin' };

    service.updateUser('1', updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('#deleteUser should delete a user', () => {
    service.deleteUser('1').subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('#changeRole should update the user role', () => {
    const user = { id: 1, name: 'John', role: 'user' };
    const updatedRole = 'developer';

    service.changeRole(user).subscribe(updatedUser => {
      expect(updatedUser.role).toBe(updatedRole);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ role: updatedRole });
    req.flush({ ...user, role: updatedRole });
  });
});
