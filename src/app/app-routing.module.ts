import { WelcomeComponent } from "./welcome/welcome.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DrugSearchComponent } from "./drug-search/drug-search.component";
import { DashBoardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "home", component: WelcomeComponent },
  { path: "searchdrug", component: DrugSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
