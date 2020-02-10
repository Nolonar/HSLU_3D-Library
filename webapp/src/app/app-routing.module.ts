import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OverviewComponent } from './overview/overview.component';
import { UploadFormComponent } from './upload-form/upload-form.component';

const routes: Routes = [
    { path: '', component: OverviewComponent },
    { path: 'detail/:id', component: DetailComponent },
    { path: 'upload', component: UploadFormComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule { }
