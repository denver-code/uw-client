import {Injectable} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {Observable, Subject} from 'rxjs';


import {AuthorizeUser} from '../../model/AuthorizeUser';
import {SessionService} from '../session.service';
import {LocalStoreManager} from './local-store-manager.service';
import {Utilities} from './utilities';
import {Global} from '../../Shared/global';

@Injectable()
export class AuthenticationService {

  private _loginStatus = new Subject<boolean>();
  private previousIsLoggedInCheck = false;

  constructor(private router: Router, private sessionService: SessionService,
              private localStorage: LocalStoreManager) {
    this.initializeLoginStatus();
  }


  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }

  getLoginStatusEvent(): Observable<boolean> {
    return this._loginStatus.asObservable();
  }

  public reevaluateLoginStatus(currentUser?: AuthorizeUser) {
    const user = currentUser || this.sessionService.AuthorizedUser;
    const isLoggedIn = user != null;

    if (this.previousIsLoggedInCheck !== isLoggedIn) {
      setTimeout(() => {
        this._loginStatus.next(isLoggedIn);
      });
    }

    this.previousIsLoggedInCheck = isLoggedIn;
  }

  redirectLoginUser() {
    let redirect = localStorage.getItem(Global.currentUrl);
    if (redirect == null) {
      redirect = 'Home';
    }
    // let urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    const urlAndParams = Utilities.splitInTwo(redirect, '?');

    const navigationExtras: NavigationExtras = {
      // fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: 'merge'
    };

    this.router.navigate([urlAndParams.firstPart], navigationExtras);

  }


}
