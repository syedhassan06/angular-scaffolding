import { BreadcrumService } from './breadcrum.service';
import {
  filter,
  map,
  takeUntil,
  pairwise,
  startWith,
  distinctUntilChanged,
  take
} from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  PRIMARY_OUTLET,
  NavigationEnd,
  Params,
  RouteConfigLoadEnd
} from '@angular/router';

interface BreadCrumb {
  label: string;
  params?: Params;
  url: string;
  resolve?: boolean;
  shown?: boolean;
}

@Component({
  selector: 'lms-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadCrumb[] = [];

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumService: BreadcrumService
  ) {}

  ngOnInit() {
    this.subscribedResolvedValues();
    //console.log("ONiNit",this.router)

    this.router.events
      .pipe(
        startWith(new NavigationEnd(0, '/', '/')),
        filter(event => {
          //console.log("event123",event);
          return (
            event instanceof NavigationEnd ||
            event instanceof RouteConfigLoadEnd
          );
        }),
        //take(1),
        distinctUntilChanged((previous: any, current: any) => {
          if (
            current instanceof NavigationEnd ||
            current instanceof RouteConfigLoadEnd
          ) {
            return true;
          }
          return false;
        }),
        takeUntil(this.destroyed$)
        //pairwise(),
      )
      //.pipe(map(() => this.activatedRoute))
      // .pipe(map((route) => {
      //   while (route.firstChild) { route = route.firstChild; }
      //   return route;
      // }))
      //.pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        //console.log("route",route)
        //console.log("route",route);
        /*let snapshot = this.router.routerState.snapshot;
      this.breadcrumbs = [];
      let url = snapshot.url;
      let routeData = route.snapshot.data;

      console.log(routeData);
      let label = routeData['breadcrumb'];
      let params = snapshot.root.params;

      this.breadcrumbs.push({
        url: url,
        label: label,
        params: params
      });*/
        const root: ActivatedRoute = this.activatedRoute.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
        //console.log('breadcrumbs',this.breadcrumbs)
      });
  }

  ngOnDestroy() {
    //console.log("NgOnDestroyed");
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private getBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadCrumb[] = []
  ): BreadCrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    const ROUTE_DATA_HIDDEN_BREADCRUMB = 'hidden';
    const ROUTE_DATA_RESOLVE_BREADCRUMB = 'resolve';

    //get the child routes
    const children: ActivatedRoute[] = route.children;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (const child of children) {
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //console.log("child.snapshot.url",child.snapshot.url);
      //get the route's URL segment
      const routeURL = child.snapshot.url
        .filter(segment => segment.path !== '')
        .map(segment => segment.path)
        .join('/');

      //console.log("child",child);

      //append route URL to URL
      if (routeURL) url += `/${routeURL}`;
      else url += `${routeURL}`;

      //add breadcrumb
      const breadcrumb: BreadCrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url,
        shown: child.snapshot.data[ROUTE_DATA_RESOLVE_BREADCRUMB]
          ? false
          : true,
        resolve: child.snapshot.data[ROUTE_DATA_RESOLVE_BREADCRUMB] || false
      };

      //If data hidden param true then it will hide them
      //console.log("child.snapshot.data[ROUTE_DATA_HIDDEN_BREADCRUMB]",child.snapshot.data[ROUTE_DATA_HIDDEN_BREADCRUMB])
      if (routeURL || !child.snapshot.data[ROUTE_DATA_HIDDEN_BREADCRUMB]) {
        breadcrumbs.push(breadcrumb);
      }

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

  setResolveValues(val) {
    this.getBreadcrumbs(this.activatedRoute);
    Object.keys(val).forEach(propertyKey => {
      const foundBreadcrum = this.breadcrumbs.find(
        item => propertyKey === item['label']
      );
      if (foundBreadcrum) {
        foundBreadcrum['label'] = val[foundBreadcrum['label']];
        foundBreadcrum.shown = true;
        //console.log('foundBreadcrum',foundBreadcrum)
      }
    });
    //console.log('getBreadcrumbs',this.breadcrumbs);
  }

  subscribedResolvedValues() {
    this.breadcrumService.breadcrumSubscriber$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(val => {
        this.setResolveValues(val);
      });
  }
}
