import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@portal/core/services/user.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { LoadingPlaceholderService } from '@portal/shared/components/loading-placeholder/loading-placeholder.service';

@Component({
  selector: 'lms-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user = null;
  private readonly destroyed$ = new Subject<void>();
  constructor(
    private userService: UserService,
    private loadingPlaceholderService: LoadingPlaceholderService
  ) {
    this.loadingPlaceholderService.show();
    this.fetchProfile();
  }

  ngOnInit() {}

  fetchProfile() {
    this.userService
      .getProfile()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.loadingPlaceholderService.hide())
      )
      .subscribe(response => {
        if (response.status) {
          this.user = response.data;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
