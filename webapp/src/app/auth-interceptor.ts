import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<object>, next: HttpHandler): Observable<HttpEvent<object>> {

        const idToken = localStorage.getItem('id_token');

        if (idToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: idToken
                }
            });
        }
        return next.handle(req);
    }
}
