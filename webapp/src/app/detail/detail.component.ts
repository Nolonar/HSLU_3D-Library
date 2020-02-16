import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faClock, faFileDownload, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { DatabaseModel } from '../models/database-model';
import { AuthService } from '../services/auth.service';
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

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private modelService: ModelService) {
        // empty
    }

    ngOnInit() {
        this.getModel();
    }

    getModel() {
        const id = this.route.snapshot.paramMap.get('id');
        this.modelService.getModelById(id).subscribe(m => {
            if (!m) {
                void this.router.navigateByUrl('/404'); // return nothing
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
