import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(public authService: AuthService, private router: Router) {
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                if (!this.authService.isLoggedIn()) {
                    this.authService.logOut();
                }
            }
        });

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuthenticated()) {
            return true;
        } else {

            console.log('unauthed')
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/signin'], {
                queryParams: {
                    returnUrl:
                        state.url
                }
            });
        }
    }

}

