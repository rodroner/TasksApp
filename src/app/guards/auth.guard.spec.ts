import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { UserService } from '../user/service/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../user/models/user.model';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserByName']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthGuard,
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if user has expected role', () => {
    const expectedRole = 'admin';
    const route: ActivatedRouteSnapshot = { data: { expectedRole: [expectedRole] } } as any;
    const state: RouterStateSnapshot = {} as any;

    const mockUser: User[] = [{ id: '1', name: 'Test User', role: expectedRole } as User];
    spyOn(localStorage, 'getItem').and.returnValue('Test User');
    userService.getUserByName.and.returnValue(of(mockUser));

    const result = authGuard.canActivate(route, state);

    result.subscribe(canActivate => {
      expect(canActivate).toBeTrue();
    });

    expect(userService.getUserByName).toHaveBeenCalledWith('Test User');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect to session if user not logged in', () => {
    const expectedRole = 'admin';
    const route: ActivatedRouteSnapshot = { data: { expectedRole: [expectedRole] } } as any;
    const state: RouterStateSnapshot = {} as any;

    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = authGuard.canActivate(route, state);

    result.subscribe(canActivate => {
      expect(canActivate).toBeFalse();
    });

    expect(router.navigate).toHaveBeenCalledWith(['/session']);
  });

  it('should deny activation and redirect to unauthorized if user does not have expected role', () => {
    const expectedRole = 'admin';
    const route: ActivatedRouteSnapshot = { data: { expectedRole: [expectedRole] } } as any;
    const state: RouterStateSnapshot = {} as any;

    const mockUser: User[] = [{ id: '1', name: 'Test User', role: 'user' } as User];
    spyOn(localStorage, 'getItem').and.returnValue('Test User');
    userService.getUserByName.and.returnValue(of(mockUser));

    const result = authGuard.canActivate(route, state);

    result.subscribe(canActivate => {
      expect(canActivate).toBeFalse();
    });

    expect(userService.getUserByName).toHaveBeenCalledWith('Test User');
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should deny activation and redirect to session if user not found in the service', () => {
    const expectedRole = 'admin';
    const route: ActivatedRouteSnapshot = { data: { expectedRole: [expectedRole] } } as any;
    const state: RouterStateSnapshot = {} as any;

    spyOn(localStorage, 'getItem').and.returnValue('Test User');
    userService.getUserByName.and.returnValue(of([]));  // Usuario no encontrado

    const result = authGuard.canActivate(route, state);

    result.subscribe(canActivate => {
      expect(canActivate).toBeFalse();
    });

    expect(userService.getUserByName).toHaveBeenCalledWith('Test User');
    expect(router.navigate).toHaveBeenCalledWith(['/session']);
  });
});
