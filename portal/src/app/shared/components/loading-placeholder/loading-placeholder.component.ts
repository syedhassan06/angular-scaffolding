import { ILoaderState } from './../../../core/models/index';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingPlaceholderService } from './loading-placeholder.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lms-loading-placeholder',
  templateUrl: './loading-placeholder.component.html',
  styleUrls: ['./loading-placeholder.component.scss']
})
export class LoadingPlaceholderComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  show;

  constructor(private loaderService: LoadingPlaceholderService) {}

  ngOnInit() {
    this.loaderService.loaderState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state: ILoaderState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
