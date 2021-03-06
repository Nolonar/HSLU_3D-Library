import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { UploadModel } from '../models/upload-model';
import { ModelService } from '../services/model.service';
import { LoaderManager } from '../viewer/loaderManager';
import { ViewerComponent } from '../viewer/viewer.component';

@Component({
    selector: 'app-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {
    @ViewChild(ViewerComponent)
    private viewer: ViewerComponent;

    public model = new UploadModel();
    faWarning = faExclamationTriangle;

    constructor(private modelService: ModelService, private location: Location) { }

    ngOnInit(): void {
        // empty
    }

    public get supportedTypes(): string {
        return LoaderManager.supportedTypes.map(t => `.${t}`).join(',');
    }

    public onSubmit(event) {
        this.model.thumbnailDataUrl = this.viewer.currentRenderFrame;
        this.modelService.postModel(this.model).subscribe(uploaded => {
            // Need to use location (instead of router), otherwise browser will not send '_id' to dbserver.
            window.location.href = `/detail/${uploaded._id}`;
        });
    }

    public onFileChange(files: FileList) {
        const file = files[0];
        this.model.file = file;

        const viewerElement = document.getElementById('viewer');
        if (file) {
            viewerElement.classList.remove('hidden');
            this.viewer.parseFile(file, file.name.split('.').pop());
        } else {
            viewerElement.classList.add('hidden');
        }
    }
}
