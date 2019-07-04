import { Drug } from "../common/models";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DrugLocationsService {
  private _url: string = "../assets/Data/drug-locations.json";
  constructor(private http: HttpClient) { }

  getDrugLocations(): Observable<any> {
    console.log(this._url);
    return this.http.get(this._url);
  }
}
