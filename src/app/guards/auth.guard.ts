import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../user/models/user.model';
import { UserService } from '../user/service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles: string[] = route.data['expectedRole'];
    let storedUser = null;

    if(typeof window !== 'undefined' && window.localStorage){
      storedUser = localStorage.getItem('userLoged');
    }

    if (storedUser) {
      return this.userService.getUserByName(storedUser).pipe(
        map((users: User[]) => {
          if (users.length > 0) {
            const userRole = users[0].role;
            if (expectedRoles && expectedRoles.includes(userRole)) {
              return true;
            } else {
              this.router.navigate(['/unauthorized']);
              return false;
            }
          } else {
            this.router.navigate(['/session']);
            return false;
          }
        })
      );
    } else {
      this.router.navigate(['/session']);
      return of(false);
    }
  }
}
