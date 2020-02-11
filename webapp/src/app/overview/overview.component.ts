import { Component, OnInit } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Model } from '../model';
import { ModelService } from '../model.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    faFilter = faFilter;

    models: Model[];
    filter = {};

    constructor(private modelService: ModelService) {
        // empty
    }

    ngOnInit() {
        this.getModels();
    }

    getModels() {
        this.modelService.getModels(this.filter).subscribe(data => this.models = data);
    }
}
