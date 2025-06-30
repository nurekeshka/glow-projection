import { Component, type OnInit, signal } from "@angular/core";
import type { VideoType } from "./components/p5/p5.component";
import { PalmComponent } from "./components/palm/palm.component";
import { PromoComponent } from "./components/promo/promo.component";

@Component({
	imports: [PalmComponent, PromoComponent],
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class App implements OnInit {
	public readonly type = signal<VideoType>("expensive");

	ngOnInit() {
		const type = window.location.href.split("type=")[1];

		if (this.ensureType(type)) this.type.set(type);
	}

	private ensureType(plain: string | null): plain is VideoType {
		return Boolean(plain && ["cheap", "expensive"].includes(plain));
	}
}
