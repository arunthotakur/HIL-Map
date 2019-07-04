import { Drug } from "../common/models";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DrugsService {
  private _url: string = "../assets/Data/drugs.json";

  constructor(private http: HttpClient) { }

  getDrugs(): Observable<any> {
    return this.http.get(this._url);
  }
}
