import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OverviewComponent } from './overview/overview.component';
import { FileExtensionPipe } from './pipes';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
    declarations: [
        AppComponent,
        DetailComponent,
        OverviewComponent,
        NotFoundComponent,
        ViewerComponent,
        FileExtensionPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
