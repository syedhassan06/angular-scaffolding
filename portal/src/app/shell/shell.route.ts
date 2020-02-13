import { Routes, Route } from '@angular/router';
import { ShellComponent } from './shell.component';
import { AuthGuard } from '../core/guards';
import { PageNotFoundComponent } from './../shared/errors/page-not-found/page-not-found.component';
export class Shell {
  static childRoutes(routes: any): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthGuard]
    };
  }
}

export const PAGE_NOT_FOUND_ROUTE: Route = {
  path: '404',
  component: PageNotFoundComponent,
  pathMatch: 'full'
};
export const CATCH_ALL_CHILDREN_Route: Route = {
  path: '**',
  redirectTo: '404',
  pathMatch: 'full'
};

export const SHELL_ROUTE: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'material',
        loadChildren: './../modules/material/material.module#MaterialModule'
      },
      {
        path: 'course',
        loadChildren: './../modules/course/course.module#CourseModule'
      },
      {
        path: 'user',
        loadChildren: './../modules/user/user.module#UserModule'
      },
      {
        path: 'report',
        loadChildren: './../modules/report/report.module#ReportModule'
      },
      {
        path: 'lesson',
        loadChildren: './../modules/lesson/lesson.module#LessonModule'
      },
      {
        path: 'dealer',
        data: {
          breadcrumb: 'Dealership'
        },
        loadChildren:
          './../modules/dealership/dealership.module#DealershipModule'
      },
      PAGE_NOT_FOUND_ROUTE
      //CATCH_ALL_CHILDREN_Route
    ],
    canActivate: [AuthGuard]
  }
];
