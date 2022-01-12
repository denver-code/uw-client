import {Injectable} from '@angular/core';
import {AuthorizeUser} from '../model/AuthorizeUser';
import {Global} from '../Shared/global';
import {CountryRegion} from '../model/CountryRegion';
import * as _moment from 'moment';
const moment =  _moment;
@Injectable()
export class SessionService {
  AuthorizedUser: AuthorizeUser = new  AuthorizeUser();
  public AuthorizeUserRole: string;
  public IsAuthenicated: boolean;
  public ConnectionSocket: boolean;
  public MessageError: string;
  public StatusError: string;
  public userError: string;
  public roleRequest = 'getService';
  public activeLanguage = 'EN';
  public backChatId = 0;
  public viewProvideId: number;
  public mail = 0;
  // public backChat = 0;
  public permission = {
    getService: 'getService',
    provider: 'provider',
    provider_getService: 'provider,getService',
    admin: 'admin',
    manager_admin: 'manager,admin',
    manager_getService_admin: 'manager,getService,admin',
    superAdmin: 'super_admin'
  };
  public PassCountryAll = [];
  public countryRegions: CountryRegion[] = [];
  public reviewsTreeSelDescription = '';
  public reviewsTreeSelRate = 0;
  constructor() {
    this.resetAuthorizeUser();
    this.MessageError = '';
    this.StatusError = '';
    this.userError = '';
  }
  public logout() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem(Global.tokenKey, '');
      localStorage.removeItem(Global.tokenKey);
      sessionStorage.setItem(Global.tokenKey, '');
      sessionStorage.removeItem(Global.tokenKey);
    }
    this.resetAuthorizeUser();
  }

  public setRoleRequest(roleRequest: string) {
    sessionStorage.setItem(Global.roleRequest, roleRequest);
    this.roleRequest = roleRequest;
  }

  public getRoleRequest() {
    if (sessionStorage.getItem(Global.roleRequest)) {
      this.roleRequest = sessionStorage.getItem(Global.roleRequest);
    }
    return this.roleRequest;
  }
  setViewProvideId(id: string){
    sessionStorage.setItem(Global.provideId, id);
    this.viewProvideId = Number(id);
  }
  public getViewProvideId() {
    if (sessionStorage.getItem(Global.provideId)) {
      this.viewProvideId = Number(sessionStorage.getItem(Global.provideId));
    }
    return this.viewProvideId;
  }
  public resetAuthorizeUser() {
    this.AuthorizedUser.EmailAddress = '';
    this.AuthorizedUser.RoleName = '';
    this.AuthorizedUser.id = '';
    this.AuthorizedUser.firstName = '';
    this.AuthorizedUser.lastName = '';
    this.AuthorizedUser.name = '';
    this.AuthorizedUser.photoUrl = null;
    this.AuthorizedUser.provider = '';
    this.AuthorizeUserRole = '';
    this.IsAuthenicated = false;
  }
  public setAuthorizeUser(data: any) {
    this.AuthorizedUser.EmailAddress = data.EmailAddress;
    this.AuthorizedUser.RoleName = data.RoleName;
    this.AuthorizedUser.id = data.id;
    this.AuthorizedUser.firstName = data.firstName;
    this.AuthorizedUser.lastName = data.lastName;
    this.AuthorizedUser.name = data.name;
    this.AuthorizedUser.photoUrl = data.photoUrl;
    this.AuthorizedUser.provider = data.provider;
    this.AuthorizeUserRole = data.RoleName;

    this.IsAuthenicated = true;
    sessionStorage.setItem(Global.emailAddress, data.EmailAddress);
    sessionStorage.setItem(Global.userRole, data.RoleName);
    sessionStorage.setItem(Global.userFBId, data.id);
    sessionStorage.setItem(Global.firstName, data.firstName);
    sessionStorage.setItem(Global.lastName, data.lastName);
    sessionStorage.setItem(Global.userName, data.name);
    sessionStorage.setItem(Global.photoUrl, data.photoUrl);
    sessionStorage.setItem(Global.provider, data.provider);
    localStorage.setItem(Global.emailAddress, data.EmailAddress);
    localStorage.setItem(Global.userRole, data.RoleName);
    localStorage.setItem(Global.userFBId, data.id);
    localStorage.setItem(Global.firstName, data.firstName);
    localStorage.setItem(Global.lastName, data.lastName);
    localStorage.setItem(Global.userName, data.name);
    localStorage.setItem(Global.photoUrl, data.photoUrl);
    localStorage.setItem(Global.provider, data.provider);
  }

  public reestablishSessionUser() {
    this.AuthorizedUser.EmailAddress = sessionStorage.getItem(Global.emailAddress);
    this.AuthorizedUser.RoleName = sessionStorage.getItem(Global.userRole);
    this.AuthorizedUser.id = sessionStorage.getItem(Global.userFBId);
    this.AuthorizedUser.firstName = sessionStorage.getItem(Global.firstName);
    this.AuthorizedUser.lastName = sessionStorage.getItem(Global.lastName);
    this.AuthorizedUser.name = sessionStorage.getItem(Global.userName);
    this.AuthorizedUser.photoUrl = sessionStorage.getItem(Global.photoUrl);
    this.AuthorizedUser.provider = sessionStorage.getItem(Global.provider);
    this.AuthorizeUserRole = sessionStorage.getItem(Global.userRole);
    this.IsAuthenicated = true;
  }
  public restoreLocalStorage() {
    let token = null;
    let emailAddress = null;
    let userRole = null;
    let userFBId = null;
    let firstNameU = null;
    let lastNameU = null;
    let userNameU = null;
    let photoUrlU = null;
    let providerU = null;
    if (!this.IsAuthenicated) {
      token = localStorage.getItem(Global.tokenKey);
      emailAddress = localStorage.getItem(Global.emailAddress);
      userRole = localStorage.getItem(Global.userRole);
      userFBId = localStorage.getItem(Global.userFBId);
      firstNameU = localStorage.getItem(Global.firstName);
      lastNameU = localStorage.getItem(Global.lastName);
      userNameU = localStorage.getItem(Global.userName);
      photoUrlU = localStorage.getItem(Global.photoUrl);
      providerU = localStorage.getItem(Global.provider);
      if (token) {
        sessionStorage.setItem(Global.tokenKey, token);
        const authUser = {
          EmailAddress: emailAddress,
          RoleName: userRole,
          id: userFBId,
          firstName: firstNameU,
          lastName: lastNameU,
          name: userNameU,
          photoUrl: photoUrlU,
          provider: providerU
        };
        this.setAuthorizeUser(authUser);
      }
    }
  }
  public IsAuthenticatedPage(componentName: string): boolean {
    let authenticatedPage: boolean;
    authenticatedPage = false;
    localStorage.setItem(Global.currentUrl, componentName);
    if (!this.IsAuthenicated) {
      const token = sessionStorage.getItem(Global.tokenKey);
      if (token) {
        this.reestablishSessionUser();
        // authenticatedPage = true;
        authenticatedPage = this.authenticatedPageСheck(componentName);
      }
      if (!this.IsAuthenicated) {
        authenticatedPage = false;
        return;
      }
    } else {
      authenticatedPage = this.authenticatedPageСheck(componentName);
    }
    return authenticatedPage;
  }
  private authenticatedPageСheck(componentName: string) {
    let authenticatedPage: boolean;
    authenticatedPage = true;
    if (componentName === 'EditProfile') {
      if (this.AuthorizeUserRole !== this.permission.getService) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'view-notification') {
      if (this.AuthorizeUserRole !== this.permission.getService) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'add-notification') {
      if (this.AuthorizeUserRole !== this.permission.getService) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'Notification') {
      if (this.AuthorizeUserRole !== this.permission.getService) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'ServiceUserProfile') {
      // console.log(this.AuthorizeUserRole);
      // alert(this.AuthorizeUserRole);
      if (this.AuthorizeUserRole !== this.permission.provider) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }

    if (componentName === 'WriteUsProvider') {
      if (this.AuthorizeUserRole !== this.permission.provider) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'ServiceHome') {
      if (this.AuthorizeUserRole !== this.permission.provider) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'ProviderChats') {
      if (this.AuthorizeUserRole !== this.permission.provider) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName.indexOf('ViewServiceNotification') !== -1) {
      if (this.AuthorizeUserRole !== this.permission.provider) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'ViewChatNotification') {
      if (!this.getPermission(this.permission.provider_getService)) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'EditProvideProfile') {
      if (this.AuthorizeUserRole !== this.permission.provider) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    if (componentName === 'ViewProvideProfile') {
      if (!this.getPermission(this.permission.provider_getService)) {
        authenticatedPage = false;
        return authenticatedPage;
      }
    }
    return authenticatedPage;
  }
  public getPermission(data: any): boolean {
    let permission: boolean;
    permission = false;
    if (this.IsAuthenicated) {
      const arrayOfStr = data.split(',');
      const se = arrayOfStr.find(x => x === this.AuthorizeUserRole);
      if (se) {
        permission = true;
      }
    }
    return permission;
  }
  public getMobilePermission(isMob: boolean, data: any): boolean {
    const show = isMob && this.getPermission(data);
    return show;
  }

  public setActiveLanguage(language: string) {
    localStorage.setItem(Global.activeLanguage, language);
    this.activeLanguage = language;
  }

  public getActiveLanguage() {
    if (localStorage.getItem(Global.activeLanguage)) {
      this.activeLanguage = localStorage.getItem(Global.activeLanguage);
    }
    return this.activeLanguage;
  }
  public dateLocaleFormat(val){
    const march = moment(val);
    if (this.activeLanguage !== 'ZN') {
      march.locale(this.activeLanguage);
    }
    else {
      march.locale('zh_CN');
    }
    const vDate =  march.format('DD MMM YYYY');
    // console.log(vDate.toString());
    return vDate.toString();
  }
}
