import { Component } from '@angular/core';
import { faSignInAlt, faSignOutAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = '3D Library – Explore And Collect';
    faUpload = faUpload;
    faSignIn = faSignInAlt;
    faSignOut = faSignOutAlt;

    constructor(
        private authService: AuthService
    ) {
        // empty
    }
}
