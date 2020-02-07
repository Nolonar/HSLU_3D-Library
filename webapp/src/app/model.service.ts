import { Injectable } from '@angular/core';

import { Model } from '../app/model';
import { Observable, of } from 'rxjs'; // TO DO: Remove when fetching models from real database

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  mockDb: Model[] = [
    {
      id: 1,
      name: "Bee",
      modelFilename: "bee.glb",
      previewFilename: "bee.png",
      creationDate: new Date(),
      uploaderId: 1
    },
    {
      id: 2,
      name: "Chicken",
      modelFilename: "chicken.glb",
      previewFilename: "chicken.png",
      creationDate: new Date(),
      uploaderId: 1
    },
    {
      id: 3,
      name: "Clown fish",
      modelFilename: "clown-fish.glb",
      previewFilename: "clown-fish.png",
      creationDate: new Date(),
      uploaderId: 1
    }
  ]

  constructor() { }

  getModels(): Observable<Model[]> {
    return of(this.mockDb);
  }

  getModel(id: number): Observable<Model> {
    return of(this.mockDb.find(m => m.id === id));
  }
}
