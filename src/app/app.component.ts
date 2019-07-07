import { Component } from "@angular/core";
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "HIL Hacktion";
  selectedUrl = "../assets/img/abc.jpg";
  ngOnInit(): void { }
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'medical_drug_pill',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/medial_drug_pill.svg')
    );
  }
}
