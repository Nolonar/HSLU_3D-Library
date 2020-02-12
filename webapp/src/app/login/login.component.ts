import { Component, OnInit } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faWarning = faExclamationTriangle;
  public name = '';
  public password = '';

  constructor(
    // private formBuilder: FormBuilder,
    // private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // empty
  }

  public onSubmit(event) {
    console.log('onsubmit');
  }

  login() {
    console.log('login');
    // const val = this.loginForm.value;

    // if (val.username && val.password) {
    // this.authService.login(val.username, val.password)
    //   .subscribe(
    //     () => {
    // console.log(`User${val.username} is logged in`);
    //       this.router.navigateByUrl('/');
    //     }
    //   );
    // }
  }
}
