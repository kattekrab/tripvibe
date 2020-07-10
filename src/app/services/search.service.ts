import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private REST_API_SERVER = environment.searchApiURL;

  constructor(private httpClient: HttpClient) { }

  public async searchDepartures(term : string, routeTypeNumber: number, pastSeconds: number) : Promise<any> {

    let response = null;

    let searchURI = this.REST_API_SERVER
      .replace("{term}", term)
      .replace("{routeType}", routeTypeNumber.toString())
      .replace("{pastSeconds}", (pastSeconds)?pastSeconds.toString():"0");
    console.log(searchURI);

    response = this.httpClient.get(searchURI);

    return response;
  }
}
