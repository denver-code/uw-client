import {throwError as observableThrowError, Observable} from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpParams} from '@angular/common/http';
// import {AppConfig} from '../services/app.config';
import {SessionService} from '../services/session.service';
import {Global} from '../Shared/global';
import { environment } from 'src/environments/environment';

@Injectable()
export class ServerService {

  constructor(private _http: HttpClient, private sessionService: SessionService) {
  }

  httpGet(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sessionStorage.getItem(Global.tokenKey) );
    const body = model;
    // const options = { params: new HttpParams({fromString: model}) };
    return this._http.get(urlUser, {headers: headers, observe: 'response',
      params: new HttpParams(body)}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }
  httpGetSelect(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    const body = model;
    // const options = { params: new HttpParams({fromString: model}) };
    return this._http.get(urlUser, {headers: headers, observe: 'response',
      params: new HttpParams(body)}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }
  login(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    console.log(urlUser);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const body = model;
    return this._http.post(urlUser, body, {headers: headers, observe: 'response'}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }
  create(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const body = model;
    return this._http.post(urlUser, body, {headers: headers, observe: 'response'}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }
  sendEmail(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const body = model;
    return this._http.post(urlUser, body, {headers: headers, observe: 'response'}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }
  httpPost(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sessionStorage.getItem(Global.tokenKey) );
    // if (typeof (Storage) !== 'undefined') {
    //   const token = sessionStorage.getItem(Global.tokenKey);
    //   headers.append('Authorization', token);
    // }
    const body = model;
    return this._http.post(urlUser, body, {headers: headers, observe: 'response'}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }
  httpPostSelect(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    const body = model;
    return this._http.post(urlUser, body, {headers: headers, observe: 'response'}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }
  forgotPassword(url: string, model: any): Observable<any> {
    const urlUser = environment.servicesBaseUrl + url;
    const oHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const body = model;
    return this._http.post(urlUser, body, {headers: oHeaders, observe: 'response'}).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }

  httpGetJson(url: string): Observable<any> {
    return this._http.get(url).map((response) => this.parseResponse(response))
      .catch((err) => this.handleError(err));
  }

  private handleError(error: any) {
    let errorText = 'Server error.';
    if (error.status && error.statusText) {
      if (error._body) {
        errorText = error._body + ' status: ' + error.status + ' status Text: ' + error.statusText;
      } else {
        errorText = 'Server error.' + ' status: ' + error.status + ' status Text: ' + error.statusText;
      }
    }
    if (error.error) {
      if (error.error.error) {
        this.sessionService.userError = error.error.error;
      }
    }
    this.sessionService.StatusError = error.status.toString();
    this.sessionService.MessageError = errorText;
    return observableThrowError(errorText || 'Server error');
  }

  globalMessageError(): string {
    let msg = 'Server error';
    if (this.sessionService.MessageError && this.sessionService.MessageError !== '') {
      msg = this.sessionService.MessageError;
    }
    this.sessionService.MessageError = '';
    return msg;
  }

  globalStatusError(): string {
    let status = '';
    if (this.sessionService.StatusError && this.sessionService.StatusError !== '') {
      status = this.sessionService.StatusError;
    }
    this.sessionService.StatusError = '';
    return status;
  }
  globalUserError(): string {
    let msg = '';
    if (this.sessionService.userError && this.sessionService.userError !== '') {
      msg = this.sessionService.userError;
    }
    this.sessionService.userError = '';
    return msg;
  }
  private parseResponse(response: any) {
    const res = response;
    return res;
  }
  calculateTotalPages(numberOfRecords: number, pageSize: number): number {
    const result = numberOfRecords % pageSize;
    let totalPages: number = 0;
    if (result > 0) { totalPages = ((numberOfRecords / pageSize) + 1); } else { totalPages = (numberOfRecords / pageSize); }
    return parseInt(totalPages.toString());
  }
}
