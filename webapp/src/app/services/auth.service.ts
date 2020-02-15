import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

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

    login(username: string, password: string) {
        return this.http.post<any>(`${this.url}/login`, { username, password })
            .pipe(tap(this.setSession));
    }

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    private setSession(authResult) {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + authResult.expiresIn);

        console.log('id_token: ' + authResult.idToken);
        console.log('expiresIn: ' + authResult.expiresIn);
        console.log('expires_at: ' + expiresAt);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    }


    public isLoggedIn() {
        return this.getExpirationDate() < new Date();
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpirationDate() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        const exirationDate = new Date(expiresAt);
        console.log('expiresAt: ' + expiresAt);
        console.log('exirationDate: ' + exirationDate);
        return exirationDate;
    }
}

