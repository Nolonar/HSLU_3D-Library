import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

    constructor(private router: Router, private route: ActivatedRoute, private modelService: ModelService) { }

    ngOnInit() {
        this.getModel();
    }

    getModel() {
        const id = this.route.snapshot.paramMap.get('id');
        this.modelService.getModelById(id).subscribe(m => {
            if (!m) {
                // Need to use router (instead of location), otherwise 404 will return an empty page.
                this.router.navigateByUrl('/404');
            }
            this.model = m;
        });
    }
}
