import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Model, ModelUpload } from '../app/model';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    url: string;

    constructor(private http: HttpClient) {
        const target = new URL(window.location.origin);
        target.port = '3000';

        let targetUrl = target.toString();
        if (targetUrl.slice(-1) === '/') {
            // Remove trailing /
            targetUrl = targetUrl.slice(0, -1);
        }
        this.url = targetUrl;
    }

    public getModels(): Observable<Model[]> {
        return this.http.get<Model[]>(`${this.url}/models`);
    }

    public postModel(model: ModelUpload): Observable<Model> {
        // Needed in order to send file to server.
        const formData = new FormData();
        formData.append('name', model.name);
        formData.append('file', model.file, model.filename);

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/octet-stream');
        return this.http.post<Model>(`${this.url}/upload`, formData, { headers });
    }

    public getModelById(id: string): Observable<Model> {
        return this.http.get<Model>(`${this.url}/model/${id}`);
    }
}
