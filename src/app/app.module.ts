import { GenericOptionsDialog } from './drug-search/generic-options-dialogue.component';
import { DrugStoresViewComponent } from './drug-stores-view/drug-stores-view.component';
import { WelcomeComponent } from "./welcome/welcome.component";
import { DrugSearchComponent } from "./drug-search/drug-search.component";
import { DrugLocationsService } from "./service/drug-locations.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { DrugsService } from "./service/drugs.service";
import { RetailersService } from "./service/retailers.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatCheckboxModule, MatFormField, MatFormFieldControl, MatFormFieldModule, MatInputModule } from "@angular/material";
import { DashBoardComponent } from "./dashboard/dashboard.component";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { AgmCoreModule } from '@agm/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    DrugSearchComponent,
    DashBoardComponent,
    WelcomeComponent,
    DrugStoresViewComponent,
    GenericOptionsDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    FlexLayoutModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAV-TV5-tLStVQGBrf_OgyxSww9jmf6yMY'
    }),
    MatSlideToggleModule,
    MatListModule,
    MatRadioModule,
    MatDialogModule
  ],
  providers: [DrugLocationsService, DrugsService, RetailersService],
  bootstrap: [AppComponent],
  entryComponents: [GenericOptionsDialog]
})
export class AppModule { }
