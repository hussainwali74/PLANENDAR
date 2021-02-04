import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // console.log('Request Intercepted');
    function settingHeaders() {
      let token = localStorage.getItem("token");
      if (token) {
        // console.log(token);
        return req.clone({
          headers: req.headers.set("authorization", token.toString()),
        });
      } else {
        console.log("not logged in");
        return req.clone({});
      }
    }
    // return next.handle(req).do(
    //   (event: HttpEvent<any>) => {
    //     if (event instanceof HttpResponse) {
    //       console.log("this is it");
    //       console.log(event);
    //     }
    //   },
    //   (e: any) => {
    //     if (e instanceof HttpErrorResponse) {
    //       if (e.status === 401) {
    //         this.router.navigateByUrl("/login");
    //       }
    //     }
    //   }
    // );

    const cloned = settingHeaders();
    return next.handle(cloned);
  }
}
