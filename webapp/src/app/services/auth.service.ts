import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtResponse } from '../models/jwt-response';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    url: string;

    constructor(private http: HttpClient) {
        const target = new URL(window.location.origin);
        target.port = '3000';

        let targetUrl = target.toString();
        if (targetUrl.slice(-1) === '/') {
            targetUrl = targetUrl.slice(0, -1);
        }
        this.url = targetUrl;
    }

    login(username: string, password: string): Observable<JwtResponse> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return this.http.post<JwtResponse>(`${this.url}/login`, formData)
            .pipe(tap(this.setSession));
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    private setSession(authResult: JwtResponse) {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + authResult.expiresIn);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    public isLoggedIn() {
        return this.getExpirationDate() < new Date();
    }

    getExpirationDate() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return new Date(expiresAt);
    }
}
