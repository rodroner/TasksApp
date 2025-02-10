import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { User } from './models/user.model';
import { UserComponent } from './user.component';
import { UserService } from './service/user.service';
import { TaskService } from '../task/service/task.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUsers', 'createUser', 'deleteUser', 'updateUser']);
    taskServiceMock = jasmine.createSpyObj('TaskService', ['removeUserFromTasks']);

    userServiceMock.getUsers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        UserComponent,
        CommonModule,
        FormsModule,
        MatButtonToggleModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize usersList as an empty array', () => {
    expect(component.usersList).toEqual([]);
  });

  it('should call refreshUserList and populate usersList', () => {
    const mockUsers: User[] = [
      { id: '1', name: 'User 1', role: "user" } as User,
      { id: '2', name: 'User 2', role: "user" } as User,
    ];
    userServiceMock.getUsers.and.returnValue(of(mockUsers));

    component.refreshUserList();

    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.usersList).toEqual(mockUsers);
  });

  it('should create a new user and show success alert', () => {

    const newUser = { name: 'New User' } as User;
    component.user = newUser;

    userServiceMock.createUser.and.returnValue(of({}));

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as SweetAlertResult));

    component.onSubmit();

    expect(userServiceMock.createUser).toHaveBeenCalledWith(newUser);

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Usuario creado',
        text: 'El usuario "' + newUser.name + '" ha sido creado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'alert alert-success',
          confirmButton: 'btn btn-primary',
        },
        timer: 2000,
        timerProgressBar: true,
      })
    );

    component.refreshUserList();

    expect(component.usersList.length).toBeGreaterThan(0);
  });

  it('should show confirmation modal and delete user', (done) => {
    const userId = '1';

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as SweetAlertResult));

    userServiceMock.deleteUser.and.returnValue(of({}));

    taskServiceMock.removeUserFromTasks.and.returnValue(of(undefined));

    component.deleteUser(userId);

    setTimeout(() => {
      expect(Swal.fire).toHaveBeenCalled();

      expect(userServiceMock.deleteUser).toHaveBeenCalledWith(userId);

      expect(taskServiceMock.removeUserFromTasks).toHaveBeenCalledWith(userId);

      done();
    }, 500);
  });

  it('should handle error if deleteUser fails', (done) => {
    const userId = '1';

    spyOn(Swal, 'fire').and.callFake((...args: any[]) => {
      if (args.length === 1 && typeof args[0] === 'string') {
        return Promise.resolve({} as SweetAlertResult);
      }

      const config = args[0] as SweetAlertOptions;

      if (config.icon === 'warning') {
        return Promise.resolve({ isConfirmed: true } as SweetAlertResult);
      }

      return Promise.resolve({} as SweetAlertResult);
    });

    userServiceMock.deleteUser.and.returnValue(throwError(() => new Error('Error')));

    component.deleteUser(userId);

    setTimeout(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'No se pudo eliminar el usuario. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'alert alert-danger',
            confirmButton: 'btn btn-primary',
          },
        })
      );
      done();
    }, 500);
  });

  it('should show the update modal and update the user', () => {
    const userId = '1';
    const userName = 'Updated User';
    component.showFormModalUpdate(userId, userName);

    expect(component.showModalUpdate).toBeTrue();
    expect(component.idUserAux).toBe(userId);
    expect(component.user.name).toBe(userName);

    userServiceMock.updateUser.and.returnValue(of({}));

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as SweetAlertResult));

    component.updateUser(userId);

    expect(userServiceMock.updateUser).toHaveBeenCalledWith(userId, component.user);
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Categoría actualizada',
        text: `La categoría "${userId}" ha sido actualizada exitosamente a "${component.user.name}"`,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'alert alert-primary',
          confirmButton: 'btn btn-primary',
        },
        timer: 2000,
        timerProgressBar: true,
      })
    );

  });

});
