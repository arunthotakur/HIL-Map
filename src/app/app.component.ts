import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "HIL Hacktion";
  selectedUrl = "../assets/img/abc.jpg";
  ngOnInit(): void {}
}
