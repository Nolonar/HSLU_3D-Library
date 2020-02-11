export class Model {
    '_id': number;
    name: string;
    filename: string;
    filetype: string;
    thumbnail: string;
    creationDate: Date;
    uploaderId: number;
}

export class ModelUpload {
    name: string;
    filename: string;
    file: File;
    thumbnailDataUrl: string
}
