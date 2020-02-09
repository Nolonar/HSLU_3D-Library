import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Model } from '../app/model';
import { MockDB } from './model-mock';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    private mockDb = MockDB.data;

    constructor(private http: HttpClient) {
        // empty
    }

    public getModels(): Observable<Model[]> {
        return this.http.get<Model[]>('http://localhost:3000/models');
    }

    public getModel(id: number): Observable<Model> {
        return this.http.get<Model>(`http://localhost:3000/model/${id}`);
    }
}
