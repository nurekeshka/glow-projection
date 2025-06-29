import p5 from "p5";

export function cheapSketch(parent: HTMLDivElement) {
	return (s: p5) => {
		let particles: Particle[] = [];

		const MAX_PARTICLES = 1200;
		const PARTICLE_LIFE = 7;
		const BRANCH_AGE = 4;

		s.setup = () => {
			const ref = s.select("#palm");
			s.createCanvas(ref?.width - 2, ref?.height - 6).parent(
				new p5.Element(parent),
			);
			s.background(255);
			s.noStroke();

			for (let i = 0; i < 3; i++) {
				const angle = s.random([
					s.random(-s.PI / 6, s.PI / 6) + s.HALF_PI,
					s.random(-s.PI / 6, s.PI / 6) - s.HALF_PI,
				]);
				const dir = p5.Vector.fromAngle(angle);
				particles.push(
					new Particle(s.createVector(s.width / 2, s.height / 2), dir, 0),
				);
			}

			s.frameRate(10);
		};

		s.draw = () => {
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.update();
				p.display();

				if (
					p.canBranch &&
					p.life === BRANCH_AGE &&
					particles.length < MAX_PARTICLES
				) {
					const numBranches = 3;
					for (let j = 0; j < numBranches; j++) {
						const branchAngle = s.random([-s.PI / 6, 0, s.PI / 6]);
						const newDir = p.dir.copy().rotate(branchAngle).normalize();
						particles.push(new Particle(p.pos.copy(), newDir, p.depth + 1));
					}
					p.canBranch = false;
				}

				if (!p.isAlive()) {
					particles.splice(i, 1);
				}
			}

			if (particles.length >= MAX_PARTICLES) {
				s.noLoop();
				console.log("Finished.");
			}
		};

		class Particle {
			canBranch: boolean;
			life: number;
			dir: p5.Vector;
			pos: p5.Vector;
			depth: number;
			maxLife: number;
			size: number;
			spacing: number;
			col: p5.Color;

			constructor(pos: p5.Vector, dir: p5.Vector, depth: number) {
				this.pos = pos.copy();
				this.dir = dir.copy();
				this.depth = depth;
				this.life = 0;
				this.maxLife = PARTICLE_LIFE;
				this.size = s.random(18, 38);
				this.spacing = s.random(30, 45);
				this.canBranch = true;

				this.col = s.color(
					s.random(10, 30),
					s.random(5, 15),
					0,
					s.random(128, 255),
				);
			}

			update() {
				const jitter = s.createVector(s.random(-0.8, 0.8), 0);

				const nextPos = p5.Vector.add(
					this.pos,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(p5 as any).Vector.mult(this.dir, this.spacing),
				).add(jitter);

				if (
					nextPos.x > 5 &&
					nextPos.x < s.width - 5 &&
					nextPos.y > 5 &&
					nextPos.y < s.height - 5
				) {
					this.pos = nextPos;
				} else {
					this.life = this.maxLife;
				}

				this.life++;
			}

			display() {
				s.fill(this.col);
				s.ellipse(this.pos.x, this.pos.y, this.size);
			}

			isAlive() {
				return (
					this.life < this.maxLife &&
					this.pos.x >= 0 &&
					this.pos.x <= s.width &&
					this.pos.y >= 0 &&
					this.pos.y <= s.height
				);
			}
		}

		s.mousePressed = () => {
			s.fullscreen(!s.fullscreen());
		};

		s.keyPressed = () => {
			if (s.key === " ") {
				particles = [];
				s.background(255);

				for (let i = 0; i < 3; i++) {
					const angle = s.random([
						s.random(-s.PI / 6, s.PI / 6) + s.HALF_PI,
						s.random(-s.PI / 6, s.PI / 6) - s.HALF_PI,
					]);
					const dir = p5.Vector.fromAngle(angle);
					particles.push(
						new Particle(s.createVector(s.width / 2, s.height / 2), dir, 0),
					);
				}

				s.loop();
			}
		};
	};
}
