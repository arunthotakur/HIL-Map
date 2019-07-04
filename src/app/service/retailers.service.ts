import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RetailersService {
  private _url: string = "../assets/Data/retailers.json";
  constructor(private http: HttpClient) { }

  getRetailers(): Observable<any> {
    return this.http.get(this._url);
  }
}
