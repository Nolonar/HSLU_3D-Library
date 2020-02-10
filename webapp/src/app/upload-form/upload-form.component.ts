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

    constructor(private modelService: ModelService) { }

    ngOnInit(): void {
    }

    public onSubmit(event) {
        this.modelService.postModel(this.model).subscribe(data => {
            console.log(data);
        });
    }
}
