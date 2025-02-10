import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {

          console.error('Error 404: Recurso no encontrado');
          this.router.navigate(['/not-found']);
        } else if (error.status === 500) {

          console.error('Error 500: Error en el servidor');
          this.router.navigate(['/server-error']);
        }

        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }
}
