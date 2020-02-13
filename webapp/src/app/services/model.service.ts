import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseModel } from '../models/database-model';
import { UploadModel } from '../models/upload-model';

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
            targetUrl = targetUrl.slice(0, -1);
        }
        this.url = targetUrl;
    }

    public getModels(filter): Observable<DatabaseModel[]> {
        const params: HttpParams = this.createHttpParams(filter);
        return this.http.get<DatabaseModel[]>(`${this.url}/models`, { params });
    }

    private createHttpParams(filter): HttpParams {
        let params = new HttpParams();
        for (const key of Object.keys(filter)) {
            const value = filter[key];
            if (value) {
                params = params.set(key, value);
            }
        }
        return params;
    }

    public postModel(model: UploadModel): Observable<DatabaseModel> {
        // Needed in order to send file to server.
        const formData = new FormData();
        formData.append('name', model.name);
        formData.append('thumbnailDataUrl', model.thumbnailDataUrl);
        formData.append('file', model.file, model.filename);

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/octet-stream');
        return this.http.post<DatabaseModel>(`${this.url}/upload`, formData, { headers });
    }

    public getModelById(id: string): Observable<DatabaseModel> {
        return this.http.get<DatabaseModel>(`${this.url}/model/${id}`);
    }

    public deleteModelById(id: string): Observable<object> {
        return this.http.delete<object>(`${this.url}/model/${id}`);
    }
}
