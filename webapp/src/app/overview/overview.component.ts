import { Component, OnInit } from '@angular/core';
import { Model } from '../model';
import { ModelService } from '../model.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

    models: Model[];

    constructor(private modelService: ModelService) {
        // empty
    }

    ngOnInit() {
        this.getModel();
    }

    getModel() {
        this.modelService.getModels().subscribe(data => this.models = data);
    }
}
