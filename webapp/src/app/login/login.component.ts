import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    faWarning = faExclamationTriangle;
    error = '';
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get formControls() {
        return this.loginForm.controls;
    }

    public login() {
        this.submitted = true;
        const username = this.loginForm.value.username;
        const password = this.loginForm.value.password;

        if (username && password) {
            this.authService.login(username, password)
                .subscribe(
                    () => {
                        void this.router.navigateByUrl('/'); // return nothing
                    },
                    error => {
                        this.error = error.error.message;
                    });
        }
    }
}
