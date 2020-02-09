import { Component } from '@angular/core';
import { faSignInAlt, faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = '3D Library – Explore And Collect';
    faUpload = faUpload;
    faSignIn = faSignInAlt;
}
