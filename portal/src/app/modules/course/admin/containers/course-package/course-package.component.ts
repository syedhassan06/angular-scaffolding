import { BreadcrumService } from '@portal/shared/breadcrum/breadcrum.service';
import { LoadingPlaceholderService } from './../../../../../shared/components/loading-placeholder/loading-placeholder.service';
import { IHttpResponse } from '@portal/core/models/index';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  ActivatedRouteSnapshot,
  RouteConfigLoadEnd,
  NavigationStart
} from '@angular/router';
import { takeUntil, filter, map, mergeMap, finalize } from 'rxjs/operators';
import { CourseService } from '@portal/core/services/course.service';
import { ICourseItem } from '@portal/core/models';
import { CoursePlaceholderService } from '../../components/course-placeholder/course-placeholder.service';

@Component({
  selector: 'lms-course-package',
  templateUrl: './course-package.component.html',
  styleUrls: ['./course-package.component.scss']
})
export class CoursePackageComponent implements OnInit, OnDestroy {
  courseID;
  course: ICourseItem;
  childRouteData = null;
  activeUrl = '';
  previousUrl = '';
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private breadcrumService: BreadcrumService
  ) {
    //this.loadingPlaceholderService.show();
    //console.log("activeRoute",this.activeRoute)
    //console.log("router",this.router)
    this.routeSubscriber();
  }

  ngOnInit() {
    //this.loadingPlaceholderService.show();
    this.activeUrl =
      this.activeRoute.firstChild.snapshot.url.length > 0 &&
      this.activeRoute.firstChild.snapshot.url[0].path;
    this.activeRoute.params.subscribe(routeParams => {
      this.courseID = routeParams.courseID;
      this.fetchCourse(routeParams.courseID);
    });

    this.activeRoute.firstChild.data.subscribe(params => {
      //console.log("params",params)
      this.childRouteData = params;
    });
  }

  fetchCourse(id: number) {
    this.courseService
      .getCourseByID(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: IHttpResponse) => {
        if (response.status) {
          this.course = response.data;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onActivate(event) {
    //console.log("e",event);
  }

  get pageType() {
    return this.courseService.coursePageType;
  }

  routeSubscriber() {
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd ||
            event instanceof RouteConfigLoadEnd
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe(route => {
        let url = '';
        if (new RegExp('.*dashboard').test(this.router.url)) {
          url = '/course/manage-list';
        } else {
          url = '/course/' + this.courseID + '/dashboard';
        }
        this.previousUrl = url;
      });
  }
}
