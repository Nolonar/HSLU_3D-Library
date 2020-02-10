import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModelUpload } from '../model';
import { ModelService } from '../model.service';

@Component({
    selector: 'app-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {
    public model = new ModelUpload();

    constructor(private modelService: ModelService, private location: Location) { }

    ngOnInit(): void {
        // empty
    }

    public onSubmit(event) {
        this.modelService.postModel(this.model).subscribe(uploaded => {
            // Need to use location (instead of router), otherwise browser will not send "_id" to dbserver.
            this.location.go(`/detail/${uploaded._id}`);
        });
    }

    public onFileChange(files: FileList) {
        this.model.file = files[0];
    }
}
