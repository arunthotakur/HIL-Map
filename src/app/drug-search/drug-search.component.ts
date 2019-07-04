import { GenericOptionsDialog } from './generic-options-dialogue.component';
import { RetailersService } from './../service/retailers.service';
import { Observable } from 'rxjs';
import { DrugsService } from "../service/drugs.service";
import { DrugLocation, Retailer } from "../common/models";
import { DrugLocationsService } from "../service/drug-locations.service";
import { Component, OnInit, Inject } from "@angular/core";
import { Drug } from "../common/models";
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: "app-drug-search",
  templateUrl: "./drug-search.component.html",
  styleUrls: ["./drug-search.component.css"]
})
export class DrugSearchComponent implements OnInit {
  drugs: Drug[] = [];
  drugNameSearchKey: string = "";
  selectedDrug: Drug;
  drugCtrl = new FormControl();
  filteredDrugs: Drug[];
  zipcode: any;
  showMap: boolean;
  showGenericOptions: boolean;
  showGenericOptionSelection: boolean;
  selectedDrugType: any;
  allDrugLocations: DrugLocation[] = [];
  filteredDrugLocations: DrugLocation[] = [];
  filteredRetailers: Retailer[] = [];
  allRetailers: Retailer[] = [];

  constructor(
    private drugLocationsService: DrugLocationsService,
    private drugsService: DrugsService,
    private retailersService: RetailersService, public dialog: MatDialog
  ) {
    this.selectedDrug = new Drug();
    this.selectedDrug.forms = [];

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GenericOptionsDialog, {
      width: '250px',
      data: { drug: this.selectedDrug }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onDrugNameChange() {
    console.log("krydf", this.drugNameSearchKey);
    if (this.drugNameSearchKey.length == 0) {
      this.filteredDrugs = [];
    } else {
      this.filteredDrugs = this.filterDrugs(this.drugNameSearchKey);
    }
  }

  ngOnInit() {
    this.addBackground();
    this.getDrugs();
    this.getAllDrugLocations();
    this.getAllRetailers();
  }

  addBackground() {
    document.getElementsByTagName("body")[0].style.background = 'url("/assets/img/map3.jpg")';
    document.getElementsByTagName("body")[0].style.display = 'block';
    document.getElementsByTagName("body")[0].style.backgroundRepeat = 'no-repeat';
    document.getElementsByTagName("body")[0].style.backgroundSize = 'cover';
    document.getElementsByTagName("body")[0].style.position = 'center';
  }

  ngOnDestroy() {
    document.getElementsByTagName("body")[0].style.background = null;
  }

  getDrugs() {
    this.drugsService.getDrugs().subscribe((data: any) => {
      this.drugs = data.drugs;
    });
  }

  getAllDrugLocations() {
    this.drugLocationsService.getDrugLocations().subscribe((data) => {
      this.allDrugLocations = data.drugLocations;
    });
  }

  getAllRetailers() {
    this.retailersService.getRetailers().subscribe((data) => {
      this.allRetailers = data.retailers;
    });
  }

  filterDrugs(drugName: string): Drug[] {
    return this.drugs.filter(e => {
      return e.drugName
        .toLocaleLowerCase()
        .includes(drugName.toLowerCase());
    });
  }

  onDrugSelect(event: any) {
    this.showGenericOptionSelection = true;
    this.selectedDrug = event.option.value;
    console.log("selected drug", this.selectedDrug);
    this.getDrugLocations();
  }
  getDisplayName(drug: Drug): string {
    return drug ? drug.drugName : '';
  }

  getDrugLocations() {
    this.selectedDrug.drugId;
    this.filteredDrugLocations = this.allDrugLocations.filter(drugLocation => {
      let drugInfo = drugLocation.drugs.filter(drugInfo => {
        return drugInfo.drugId == this.selectedDrug.drugId;
      });
      if (drugInfo) {
        return true;
      } else {
        return false;
      }
    });
    console.log("dl", this.filteredDrugLocations);

    this.filteredRetailers = this.allRetailers.filter((retailer: Retailer) => {
      let drugLocation = this.filteredDrugLocations.filter((drugLocation: DrugLocation) => {
        return drugLocation.retailerId == retailer.retailerId;
      });
      if (drugLocation) {
        return true;
      } else {
        return false;
      }
    });
    console.log("ret", this.filteredRetailers);
    if (this.zipcode) {
      this.filterByZipcode();
    }
  }

  filterByZipcode() {
    this.filteredRetailers = this.filteredRetailers.filter((retailer: Retailer) => {
      return retailer.zipcode == this.zipcode;
    });
    console.log("zipcode", this.filteredRetailers);

  }
}
