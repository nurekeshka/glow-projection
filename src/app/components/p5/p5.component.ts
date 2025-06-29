import {
	type AfterViewInit,
	Component,
	type ElementRef,
	type OnDestroy,
	input,
	viewChild,
} from "@angular/core";
import p5 from "p5";
import { cheapSketch } from "./scripts/p5.cheap";
import { expensiveSketch } from "./scripts/p5.expensive";

export type VideoType = "cheap" | "expensive";

@Component({
	selector: "app-p5",
	templateUrl: "./p5.component.html",
	styleUrl: "./p5.component.scss",
})
export class P5Component implements AfterViewInit, OnDestroy {
	private readonly canvasContainer =
		viewChild<ElementRef<HTMLDivElement>>("canvasContainer");

	private p5!: p5;

	type = input.required<VideoType>();

	ngAfterViewInit(): void {
		this.createCanvas();
	}

	ngOnDestroy(): void {
		this.p5.remove();
	}

	private createCanvas() {
		const container = this.canvasContainer()?.nativeElement;
		if (!container) return;

		const sketch =
			this.type() === "expensive"
				? expensiveSketch(container)
				: cheapSketch(container);
		this.p5 = new p5(sketch, container);
	}
}
