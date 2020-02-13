import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faClock, faFileDownload, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { DatabaseModel } from '../models/database-model';
import { ModelService } from '../services/model.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    model: DatabaseModel;
    faDownload = faFileDownload;
    faUser = faUser;
    faDate = faClock;
    faDelete = faTrash;

    constructor(private router: Router, private route: ActivatedRoute, private modelService: ModelService) { }

    ngOnInit() {
        this.getModel();
    }

    getModel() {
        const id = this.route.snapshot.paramMap.get('id');
        this.modelService.getModelById(id).subscribe(m => {
            if (!m) {
                // Need to use router (instead of location), otherwise 404 will return an empty page.
                void this.router.navigateByUrl('/404'); // No need to handle promise when redirecting.
            }
            this.model = m;
        });
    }

    deleteModel() {
        const id = this.model._id;
        this.modelService.deleteModelById(id).subscribe(response => {
            window.location.href = '/';
        });
    }
}
