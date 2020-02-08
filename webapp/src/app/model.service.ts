import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // TO DO: Remove when fetching models from real database
import { Model } from '../app/model';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    private beeFile = 'bee.glb';
    private beeImage = 'bee.png';
    private chickenFile = 'chicken.glb';
    private chickenImage = 'chicken.png';
    private clownFishFile = 'clown-fish.glb';
    private clownFishImage = 'clown-fish.png';
    mockDb: Model[] = [
        }
            id: 4,
            name: 'Suzanne',
            modelFilename: 'suzanne.obj',
            previewFilename: 'suzanne.png',
            creationDate: new Date(),
            uploaderId: 1
        },{
            id: 1,
            name: 'Bee 1',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 1',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 1',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        }, {
            id: 1,
            name: 'Bee 2',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 2',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 2',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        }, {
            id: 1,
            name: 'Bee 3',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 3',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 3',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        }, {
            id: 1,
            name: 'Bee 4',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 4',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 4',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        }, {
            id: 1,
            name: 'Bee 5',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 5',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 5',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        }, {
            id: 1,
            name: 'Bee 6',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 6',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 6',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        }, {
            id: 1,
            name: 'Bee 7',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 7',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 7',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        }, {
            id: 1,
            name: 'Bee 8',
            modelFilename: this.beeFile,
            previewFilename: this.beeImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 2,
            name: 'Chicken 8',
            modelFilename: this.chickenFile,
            previewFilename: this.chickenImage,
            creationDate: new Date(),
            uploaderId: 1
        },
        {
            id: 3,
            name: 'Clown fish 8',
            modelFilename: this.clownFishFile,
            previewFilename: this.clownFishImage,
            creationDate: new Date(),
            uploaderId: 1
        },
    ];

    constructor() {
        // empty
    }

    getModels(): Observable<Model[]> {
        return of(this.mockDb);
    }

    getModel(id: number): Observable<Model> {
        return of(this.mockDb.find(m => m.id === id));
    }
}
