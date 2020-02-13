import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { PrincipalService } from '@portal/core/services/principal.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the roles passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *lmsAccessPermission="'ADMIN'">...</some-element>
 *
 *     <some-element *lmsAccessPermission="['ADMIN', 'MANAGER','LEARNER']">...</some-element>
 * ```
 */

@Directive({
  selector: '[lmsAccessPermission]'
})
export class AccessPermissionDirective {
  private roles: string[];

  constructor(
    private principal: PrincipalService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  @Input()
  set lmsAccessPermission(value: string | string[]) {
    this.roles = typeof value === 'string' ? [<string>value] : <string[]>value;
    this.updateView();
    // Get notified each time authentication state changes.
    this.principal
      .getAuthenticationState()
      .subscribe(identity => this.updateView());
  }

  private updateView(): void {
    this.principal.hasAccess(this.roles).then(result => {
      this.viewContainerRef.clear();
      if (result) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
