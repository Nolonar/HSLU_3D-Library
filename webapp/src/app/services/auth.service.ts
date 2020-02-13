import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

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
        return this.http.post<User>(`${this.url}/login`, { username, password });
    }
}

