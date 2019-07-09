import { Component, OnInit, Input } from '@angular/core';
import { Retailer } from '../common/models';

@Component({
  selector: 'drug-stores-view',
  templateUrl: './drug-stores-view.component.html',
  styleUrls: ['./drug-stores-view.component.scss']
})
export class DrugStoresViewComponent implements OnInit {

  @Input() filteredRetailers: Retailer[] = [];
  lat: number = 51.678418;
  lng: number = 7.809007;
  constructor() { }

  ngOnInit(): void {

  }

  getLabel(retailer: Retailer) {
    if (retailer.drugPrice) {
      return '$' + retailer.drugPrice.toString();
    } else {
      return ' ';
    }
  }
}
