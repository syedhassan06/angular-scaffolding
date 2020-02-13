import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services';
import { IHttpResponse } from './core/models/index';

@Component({
  selector: 'lms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'portal';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.populate().subscribe(
      (response: IHttpResponse) => {
        if (response && response.status) {
          //console.log("response.data",response.data)
          this.authService.setAuth(response.data);
        } else {
          this.authService.purgeAuth();
        }
      },
      (err: IHttpResponse) => {
        this.authService.purgeAuth();
      }
    );
  }
}
