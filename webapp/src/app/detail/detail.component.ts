import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { Model } from '../model';
import { ModelService } from '../model.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    model: Model;
    faDownload = faFileDownload;

    constructor(private route: ActivatedRoute, private modelService: ModelService) { }

    ngOnInit() {
        this.getModel();
    }

    getModel() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.modelService.getModel(id).subscribe(m => this.model = m);
    }
}
