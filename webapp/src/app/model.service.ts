import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // TO DO: Remove when fetching models from real database
import { Model } from '../app/model';
import { MockDB } from './model-mock';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    private mockDb = MockDB.data;

    constructor() {
        // empty
    }

    public getModels(): Observable<Model[]> {
        return of(this.mockDb);
    }

    public getModel(id: number): Observable<Model> {
        return of(this.mockDb.find(m => m.id === id));
    }
}
