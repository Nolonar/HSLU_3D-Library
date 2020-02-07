import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';
import { AppRoutingModule } from './app-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
    declarations: [
        AppComponent,
        DetailComponent,
        OverviewComponent,
        NotFoundComponent,
        ViewerComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
