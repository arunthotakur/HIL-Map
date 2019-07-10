import { GenericOptionsDialog } from './generic-options-dialogue.component';
import { RetailersService } from './../service/retailers.service';
import { Observable } from 'rxjs';
import { DrugsService } from "../service/drugs.service";
import { DrugLocation, Retailer, RetailerAndDrugPrice, DrugForm } from "../common/models";
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
  zipcode: any = 10001;
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
  selectedForm: DrugForm;
  constructor(
    private drugLocationsService: DrugLocationsService,
    private drugsService: DrugsService,
    private retailersService: RetailersService, public dialog: MatDialog
  ) {
    this.selectedDrug = new Drug();
    this.selectedDrug.forms = [];
    this.selectedForm = new DrugForm();
  }

  onFormChange(changedForm: any) {
    console.log("on form change", changedForm);
    for (let form of this.selectedDrug.forms) {
      if (form.type == changedForm) {
        this.selectedForm = form;
        console.log("form changed", form);
        break;
      }
    }
    console.log("on form select", this.selectedForm);
  }

  onStrengthChange(changedStrength: any) {
    console.log("on strength change", this.selectedForm);

    for (let form of this.selectedDrug.forms) {
      if (form.strength == changedStrength) {
        this.selectedForm = form;
        break;
      }
    }
  }

  onQuantityChange(changedQuantity: any) {
    console.log("on quantity change", this.selectedForm);
    for (let form of this.selectedDrug.forms) {
      if (form.quantity == changedQuantity) {
        this.selectedForm = form;
        console.log("on select", this.selectedForm);
        break;
      }
    }
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
    this.getDrugs();
    this.getAllDrugLocations();
    this.getAllRetailers();
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
    for (let form of this.selectedDrug.forms) {
      form.quantity = form.quantity + ' ' + form.unit;
    }
    console.log("forms", this.selectedDrug.forms);
    for (let form of this.selectedDrug.forms) {
      this.selectedForm = form;
      break;
    }

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
      if (!(this.quantitiesList.indexOf(form.quantity) > -1)) {
        this.quantitiesList.push(form.quantity);
      }
    }
  }
  getDisplayName(drug: Drug): string {
    return drug ? drug.drugName : '';
  }

  getDrugLocations() {
    this.filteredRetailers = [];
    this.filteredDrugLocations = [];
    for (let filterDrugLocation of this.allDrugLocations) {
      for (let drug of filterDrugLocation.drugs) {
        if (drug.drugId == this.selectedDrug.drugId) {
          this.filteredDrugLocations.push(filterDrugLocation);
        }
      }
    }
    console.log("filtered drug locations", this.filteredDrugLocations);
    for (let filteredLocation of this.filteredDrugLocations) {
      for (let retailer of this.allRetailers) {
        retailer.drugPrice = null;
        if (retailer.retailerId == filteredLocation.retailerId) {
          this.filteredRetailers.push(retailer);
        }
      }
    }
    console.log("filtered retailers", this.filteredRetailers);
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
    let drugPrice = this.selectedForm.price;
    console.log("drug price", drugPrice);
    for (let drugLocation of this.filteredDrugLocations) {
      for (let drug of drugLocation.drugs) {
        if (drug.drugId == this.selectedDrug.drugId) {
          for (let filteredRetailer of this.filteredRetailers) {
            if (drugLocation.retailerId == filteredRetailer.retailerId) {
              filteredRetailer.drugPrice = drugPrice - ((drug.discount * drugPrice) / 100);
              break;
            }
          }
        }
      }
    }
    console.log("the final list", this.filteredRetailers);
  }
}
