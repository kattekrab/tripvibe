import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { DataEntryService } from '../../services/data-entry.service';
import { Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {

  constructor(private nearbyService : NearbyService, private dataEntryService : DataEntryService, private geoService : GeolocationService, private _loc :Location ) { }

  departures = [];
 
  ngOnInit(): void {
    this.nearbyService.getDeparturesNearby().then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);
        this.departures = deps.sort((a, b) => new Date(a.departureTime).valueOf() - new Date(b.departureTime).valueOf());
      } );
    } );
  }

  onSubmit() {
    console.log (
      { 
        capacity: this.capacity, 
        route_direction: this.route_direction, 
        route_number: this.route_number, 
        route_type: this.route_type,
        stop_name: this.stop_name,
        vibe: this.vibe
      });

      let location : any;
      this.geoService.getPosition().then(pos => {
        this.dataEntryService.postData(
          {
            location_lat: pos.lat,
            location_lng: pos.lng,
            sentiment: {
              capacity: this.capacity, 
              route_direction: this.route_direction, 
              route_number: this.route_number, 
              route_type: this.route_type,
              stop_name: this.stop_name,
              vibe: this.vibe,
              departure_time: new Date()
            },
            submitter: {
              device_id: "8316080933289526961"
            }
          }
        ).then(result => {
          result.subscribe(c => console.log(c));
          this.submitStatusMessage = "Success";
        }).catch( err => {
          console.log("Failed" + err);
          this.submitStatusMessage = "Failed";
        }).finally(() => {
          setTimeout(() => this._loc.back(), 1500);
        })
      });
  }

  capacity: number = 50;
  route_direction: string;
  route_number: string;
  route_type: string;
  stop_name: string;
  vibe: number;

  isRouteNumberVisible = false;

  onRouteTypeChange() {
    if (this.route_type === "Tram" || this.route_type === "Bus") {
      this.isRouteNumberVisible = true;
    } else {
      this.isRouteNumberVisible = false;
    }
  }

  submitStatusMessage = "";
  /*
{
  "location_lat": -27.502,
  "location_lng": 152.897,
  "sentiment": {
    "capacity": 50,
    "route_direction": "City",
    "route_number": "216",
    "route_type": "Bus",
    "stop_name": "Sunshine Station - City via Dynon Rd",
    "vibe": 67,
    "departure_time": "2020-06-23T05:27:24.000Z"
  },
  "submitter": {
    "device_id": "8316080933289526961"
  }
}
  */
}