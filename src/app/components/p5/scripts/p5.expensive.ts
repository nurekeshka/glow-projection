import p5 from "p5";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function expensiveSketch(parent: HTMLDivElement) {
	return (s: p5) => {
		const particles: Particle[] = [];
		let hueShift = 0;
		const MAX_PARTICLES = 150;
		const TARGET_ORIGINS = 3;

		s.setup = async () => {
			s.fullscreen();
			const ref = s.select("#palm");
			s.createCanvas(ref?.width - 50, ref?.height + 200).parent(
				new p5.Element(parent),
			);

			await delay(3000);
			s.colorMode(s.HSL, 360, 100, 100, 255);
			s.background(0, 0, 0);
			s.noStroke();
			s.frameRate(30);
		};

		s.draw = () => {
			s.background(0, 0, 0, 20);
			hueShift = (hueShift + 0.1) % 360;

			let currentOrigins = particles.filter((p) => p.depth === 0).length;

			if (currentOrigins < TARGET_ORIGINS) {
				for (let i = 0; i < TARGET_ORIGINS - currentOrigins; i++) {
					if (particles.length < MAX_PARTICLES) {
						const startPos = s.createVector(
							s.random(s.width),
							s.random(s.height),
						);
						const angle = s.random(s.TWO_PI);
						const dir = p5.Vector.fromAngle(angle);
						particles.push(new Particle(startPos, dir, 0));
					}
				}
			} else if (currentOrigins > TARGET_ORIGINS) {
				for (
					let i = particles.length - 1;
					i >= 0 && currentOrigins > TARGET_ORIGINS;
					i--
				) {
					if (particles[i].depth === 0) {
						particles.splice(i, 1);
						currentOrigins--;
					}
				}
			}

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.update();
				p.display(hueShift);

				if (
					p.canBranch &&
					p.age > p.branchDelay &&
					p.depth < 6 &&
					s.random() < 0.1
				) {
					const branches = s.int(s.random(2, 4));
					for (let j = 0; j < branches; j++) {
						if (particles.length < MAX_PARTICLES) {
							const branchAngle = s.random(-s.PI / 3, s.PI / 3);
							const newDir = p.dir.copy().rotate(branchAngle).normalize();
							particles.push(new Particle(p.pos.copy(), newDir, p.depth + 1));
						}
					}
					p.canBranch = false;
					if (s.random() < 0.5) {
						p.branchDelay = p.age + s.int(s.random(20, 80));
						p.canBranch = true;
					}
				}

				if (!p.isAlive()) {
					particles.splice(i, 1);
				}
			}
		};

		s.mousePressed = () => {
			s.fullscreen(!s.fullscreen());
		};

		class Particle {
			pos: p5.Vector;
			dir: p5.Vector;
			depth: number;
			stepSize: number;
			timer: number;
			interval: number;
			age: number;
			lifespan: number;
			branchDelay: number;
			canBranch: boolean;
			alpha: number;

			constructor(pos: p5.Vector, dir: p5.Vector, depth: number) {
				this.pos = pos.copy();
				this.dir = dir.copy();
				this.depth = depth;
				this.stepSize = 10;
				this.timer = 0;
				this.interval = 4;
				this.age = 0;
				this.lifespan = s.int(s.random(160, 280));
				this.branchDelay = s.int(s.random(10, 30));
				this.canBranch = true;
				this.alpha = s.random(240, 255);
			}

			update() {
				this.timer++;
				this.age++;

				const wobble = s.map(
					s.noise(this.pos.x * 0.005, this.pos.y * 0.005),
					0,
					1,
					-0.05,
					0.05,
				);
				this.dir.rotate(wobble);

				const center = s.createVector(s.width / 2, s.height / 2);
				const distToCenter = p5.Vector.dist(this.pos, center);
				if (distToCenter < 80) {
					const away = p5.Vector.sub(this.pos, center).normalize();
					this.dir = p5.Vector.lerp(this.dir, away, 0.03);
				}

				if (
					(this.pos.x < 10 && this.dir.x < 0) ||
					(this.pos.x > s.width - 10 && this.dir.x > 0)
				)
					this.dir.x *= -1;
				if (
					(this.pos.y < 10 && this.dir.y < 0) ||
					(this.pos.y > s.height - 10 && this.dir.y > 0)
				)
					this.dir.y *= -1;

				if (this.timer % this.interval === 0) {
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					this.pos.add((p5 as any).Vector.mult(this.dir, this.stepSize));
				}
			}

			display(hueShift: number) {
				if (this.timer % this.interval === 0) {
					const size = s.random(8, 12);
					const hue = getWarmHue(hueShift, this.depth);
					const sat = 80;
					const light = 75;

					s.drawingContext.shadowBlur = 25;
					s.drawingContext.shadowColor = `hsla(${hue}, ${sat}%, ${light}%, ${
						this.alpha / 255
					})`;

					s.fill(hue, sat, light, this.alpha);
					s.ellipse(this.pos.x, this.pos.y, size);

					s.drawingContext.shadowBlur = 0;
				}
			}

			onScreen() {
				return (
					this.pos.x >= 0 &&
					this.pos.x <= s.width &&
					this.pos.y >= 0 &&
					this.pos.y <= s.height
				);
			}

			isAlive() {
				return this.age < this.lifespan;
			}
		}

		function getWarmHue(shift: number, depth: number) {
			const phases = [
				[10, 30], // orange-red
				[330, 350], // pink
				[40, 55], // gold
			];
			const index = s.floor((shift / 10 + depth) % phases.length);
			const range = phases[index];
			const localShift = (shift * 5) % (range[1] - range[0]);
			return range[0] + localShift;
		}
	};
}
