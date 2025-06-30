import { Component, type OnInit, computed, input, signal } from "@angular/core";
import type { VideoType } from "../p5/p5.component";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
	selector: "app-promo",
	templateUrl: "./promo.component.html",
	styleUrl: "./promo.component.scss",
	host: { class: "mt-auto h-50" },
})
export class PromoComponent implements OnInit {
	type = input.required<VideoType>();
	video = computed(() =>
		this.type() === "expensive" ? "/videos/luxury.mp4" : "/videos/cheap.mp4",
	);

	show = signal(false);

	async ngOnInit(): Promise<void> {
		await delay(6000);
		this.show.set(true);
	}
}
