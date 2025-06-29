import { Component, input } from "@angular/core";
import { P5Component, type VideoType } from "../p5/p5.component";

@Component({
	imports: [P5Component],
	selector: "app-palm",
	templateUrl: "./palm.component.html",
	styleUrl: "./palm.component.scss",
	host: { class: "position-relative w-100" },
})
export class PalmComponent {
	type = input.required<VideoType>();
}
