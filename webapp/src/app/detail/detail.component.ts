import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faClock, faFileDownload, faUser } from '@fortawesome/free-solid-svg-icons';
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
    faUser = faUser;
    faDate = faClock;

    constructor(private route: ActivatedRoute, private modelService: ModelService) { }

    ngOnInit() {
        this.getModel();
    }

    getModel() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.modelService.getModelById(id).subscribe(m => this.model = m);
    }
}
