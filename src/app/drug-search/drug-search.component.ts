import { GenericOptionsDialog } from './generic-options-dialogue.component';
import { RetailersService } from './../service/retailers.service';
import { Observable } from 'rxjs';
import { DrugsService } from "../service/drugs.service";
import { DrugLocation, Retailer, RetailerAndDrugPrice } from "../common/models";
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
  showNoResultsFound: boolean = false;
  drugs: Drug[] = [];
  drugNameSearchKey: string = "";
  selectedDrug: Drug;
  drugCtrl = new FormControl();
  filteredDrugs: Drug[];
  zipcode: any = 19021;
  showMap: boolean;
  showGenericOptions: boolean = false;
  showGenericOptionSelection: boolean;
  selectedDrugType: any;
  selectedDrugStrength: any;
  selectedDrugQuantity: any;
  allDrugLocations: DrugLocation[] = [];
  filteredDrugLocations: DrugLocation[] = [];
  filteredRetailers: Retailer[] = [];
  allRetailers: Retailer[] = [];
  strengthsList: any = [];
  formsList: any = [];
  quantitiesList: any = [];
  retailerAndDrugPriceDetailsList: RetailerAndDrugPrice[] = [];
  constructor(
    private drugLocationsService: DrugLocationsService,
    private drugsService: DrugsService,
    private retailersService: RetailersService, public dialog: MatDialog
  ) {
    this.selectedDrug = new Drug();
    this.selectedDrug.forms = [];

  }

  openDialog(): void {
    // const dialogRef = this.dialog.open(GenericOptionsDialog, {
    //   width: '250px',
    //   data: { drug: this.selectedDrug }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  onChange() {
    console.log("change", this.showGenericOptions);
    this.showGenericOptions = !this.showGenericOptions;
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
    // document.getElementsByTagName("body")[0].style.background = 'url("/assets/img/map3.jpg")';
    // document.getElementsByTagName("body")[0].style.display = 'block';
    // document.getElementsByTagName("body")[0].style.backgroundRepeat = 'no-repeat';
    // document.getElementsByTagName("body")[0].style.backgroundSize = 'cover';
    // document.getElementsByTagName("body")[0].style.position = 'center';
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
    this.strengthsList = [];
    this.formsList = [];
    this.quantitiesList = [];
    this.selectedDrugType = null;
    this.selectedDrugQuantity = null;
    this.selectedDrugStrength = null;
    for (let form of this.selectedDrug.forms) {
      if (!(this.strengthsList.indexOf(form.strength) > -1)) {
        this.strengthsList.push(form.strength);
      }
      if (!(this.formsList.indexOf(form.type) > -1)) {
        this.formsList.push(form.type);
      }
      if (!(this.quantitiesList.indexOf(form.quantity + ' ' + form.unit) > -1)) {
        this.quantitiesList.push(form.quantity + ' ' + form.unit);
      }
    }
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

  filterByGenericOptions() {
    this.retailerAndDrugPriceDetailsList = [];
    this.showNoResultsFound = false;
    let drugPrice = this.checkDrugExisits();
    console.log("drug price", drugPrice);
    if (drugPrice != 0) {
      this.filteredDrugLocations.map((drugLocation) => {
        drugLocation.drugs.map(drug => {
          if (drug.drugId == this.selectedDrug.drugId) {
            this.filteredRetailers.map((retailer) => {
              if (retailer.retailerId == drugLocation.retailerId) {
                let retailerAndDrugPriceDetails = new RetailerAndDrugPrice();
                retailerAndDrugPriceDetails.drugId = this.selectedDrug.drugId;
                retailerAndDrugPriceDetails.price = drugPrice - ((drug.discount * drugPrice) / 100);
                retailerAndDrugPriceDetails.retailerAddress = retailer.address;
                retailerAndDrugPriceDetails.retailerId = retailer.retailerId;
                retailerAndDrugPriceDetails.retailerZipcode = retailer.zipcode;
                this.retailerAndDrugPriceDetailsList.push(retailerAndDrugPriceDetails);
              }
            });
          }
        });
      });
    } else {
      this.showNoResultsFound = true;
    }
    console.log("the final list", this.retailerAndDrugPriceDetailsList);
  }

  checkDrugExisits() {
    let drugExists = false;
    let drugPrice = 0;
    this.selectedDrug.forms.map(form => {
      if (this.selectedDrugQuantity) {
        drugExists = form.quantity == this.selectedDrugQuantity;
        if (drugExists) {
          drugPrice = form.price;
        }
      }

      if (this.selectedDrugStrength) {
        drugExists = form.strength == this.selectedDrugStrength;
        if (drugExists) {
          drugPrice = form.price;
        }
      }

      if (this.selectedDrugType) {
        drugExists = form.type = this.selectedDrugType;
        if (drugExists) {
          drugPrice = form.price;
        }
      }
    });

    return drugPrice;
  }
}
