import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IGenericCustomDeactivate } from '../../model/interface/igeneric-custom-deactivate.interface';

@Injectable()
export class CustomDeactivateGuard implements CanDeactivate<IGenericCustomDeactivate> {
    canDeactivate(
        component: IGenericCustomDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return component.alertBeforeLeave();
    }
}