export class StringHelper {
    public static getFileExtension(filename: string) {
        return filename.split('.').pop();
    }
}
