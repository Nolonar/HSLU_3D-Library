export class Model {
    '_id': number;
    name: string;
    modelFilename: string;
    previewFilename: string;
    creationDate: Date;
    uploaderId: number;
}

export class ModelUpload {
    name: string;
    file: File;
}
