import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importar este módulo
import { of, throwError } from 'rxjs';

import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';

import { AuthComponent } from './auth.component';
import { UserService } from '../service/user.service';
import { AppComponent } from '../../core/app.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let appComponent: jasmine.SpyObj<AppComponent>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserByName', 'createUser']);
    const appComponentSpy = jasmine.createSpyObj('AppComponent', ['getUserInLocalStorage']);

    await TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AppComponent, useValue: appComponentSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    appComponent = TestBed.inject(AppComponent) as jasmine.SpyObj<AppComponent>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getUserInLocalStorage', () => {
    it('should retrieve the user from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('testUser');
      component.getUserInLocalStorage();
      expect(component.storedUser).toBe('testUser');
    });
  });

  describe('#disconnect', () => {
    it('should remove the user from localStorage and reset storedUser', () => {
      spyOn(localStorage, 'removeItem');
      component.storedUser = 'testUser';
      component.disconnect();
      expect(localStorage.removeItem).toHaveBeenCalledWith('userLoged');
      expect(component.storedUser).toBeNull();
      expect(appComponent.getUserInLocalStorage).toHaveBeenCalled();
    });
  });

  describe('#onLoginSubmit', () => {
    it('should show a success alert and save user to localStorage when login is successful', () => {
      spyOn(Swal, 'fire');
      spyOn(localStorage, 'setItem');

      const mockUser = { name: 'testUser', password: bcrypt.hashSync('password', 10) };
      userService.getUserByName.and.returnValue(of([mockUser]));

      component.user = { name: 'testUser', password: 'password', role: 'user' };
      component.onLoginSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'Inicio de sesión exitoso' }));
      expect(localStorage.setItem).toHaveBeenCalledWith('userLoged', 'testUser');
      expect(component.storedUser).toBe('testUser');
    });

    it('should show a warning alert when user does not exist', () => {
      spyOn(Swal, 'fire');

      userService.getUserByName.and.returnValue(of([]));

      component.user = { name: 'nonExistentUser', password: 'password', role: 'user' };
      component.onLoginSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'El nombre de usuario no existe' }));
    });

    it('should show a warning alert when password is incorrect', () => {
      spyOn(Swal, 'fire');

      const mockUser = { name: 'testUser', password: bcrypt.hashSync('password', 10) };
      userService.getUserByName.and.returnValue(of([mockUser]));

      component.user = { name: 'testUser', password: 'wrongPassword', role: 'user' };
      component.onLoginSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'La contraseña es incorrecta' }));
    });

    it('should handle service errors gracefully', () => {
      spyOn(console, 'error');
      userService.getUserByName.and.returnValue(throwError(() => new Error('Service error')));

      component.user = { name: 'testUser', password: 'password', role: 'user' };
      component.onLoginSubmit();

      expect(console.error).toHaveBeenCalledWith('Error al obtener los usuarios:', jasmine.any(Error));
    });
  });

  describe('#onRegisterSubmit', () => {
    it('should show a success alert and save user to localStorage when registration is successful', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: null,
        })
      );

      spyOn(localStorage, 'setItem');

      userService.createUser.and.returnValue(of({}));

      component.userRegister = {
        name: 'newUser',
        password: 'password',
        password_2: 'password',
        role: 'user'
      };

      component.onRegisterSubmit();

      tick();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({ title: 'Usuario registrado' })
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('userLoged', 'newUser');
    }));

    it('should not proceed with registration if passwords do not match', () => {
      component.userRegister = {
        name: 'newUser',
        password: 'password1',
        password_2: 'password2',
        role: 'user'
      };

      // Ejecutar el método
      component.onRegisterSubmit();

      // Verificar que no se llama al servicio
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });

});
