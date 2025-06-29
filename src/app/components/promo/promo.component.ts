import { Component, computed, input } from "@angular/core";
import type { VideoType } from "../p5/p5.component";

@Component({
	selector: "app-promo",
	templateUrl: "./promo.component.html",
	styleUrl: "./promo.component.scss",
	host: { class: "mt-auto mb-auto" },
})
export class PromoComponent {
	type = input.required<VideoType>();
	video = computed(() =>
		this.type() === "expensive" ? "/videos/luxury.mp4" : "/videos/cheap.mp4",
	);
}
