import { Pipe, PipeTransform } from '@angular/core';
import { StringHelper } from './helpers';

@Pipe({ name: 'fileExtension' })
export class FileExtensionPipe implements PipeTransform {
    transform(value: string): string {
        return StringHelper.getFileExtension(value);
    }
}
