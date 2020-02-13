import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  faWarning = faExclamationTriangle;

  constructor(
    private formBuilder: FormBuilder,
    // private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public login() {
    console.log('login');
    const values = this.loginForm.value;

    if (values.username && values.password) {
      // this.authService.login(val.username, val.password)
      //   .subscribe(
      //     () => {
      console.log(`User ${values.username} is logged in`);
      //       this.router.navigateByUrl('/');
      //     }
      //   );
      // }
    }
  }
}
