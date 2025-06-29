import { Component } from "@angular/core";
import { PalmComponent } from "./components/palm/palm.component";
import { PromoComponent } from "./components/promo/promo.component";

@Component({
	imports: [PalmComponent, PromoComponent],
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class App {
	public readonly type = "cheap";
}
