"use strict";
// http://mrl.nyu.edu/~perlin/noise/
class Noise {
	constructor(octaves = 1) {
		this.p = new Uint8Array(512);
		this.octaves = octaves;
		this.init();
	}
	init() {
		for (let i = 0; i < 512; ++i) {
			this.p[i] = Math.random() * 256;
		}
	}
	lerp(t, a, b) {
		return a + t * (b - a);
	}
	grad2d(i, x, y) {
		const v = (i & 1) === 0 ? x : y;
		return (i & 2) === 0 ? -v : v;
	}
	noise2d(x2d, y2d) {
		const X = Math.floor(x2d) & 255;
		const Y = Math.floor(y2d) & 255;
		const x = x2d - Math.floor(x2d);
		const y = y2d - Math.floor(y2d);
		const fx = (3 - 2 * x) * x * x;
		const fy = (3 - 2 * y) * y * y;
		const p0 = this.p[X] + Y;
		const p1 = this.p[X + 1] + Y;
		return this.lerp(
			fy,
			this.lerp(
				fx,
				this.grad2d(this.p[p0], x, y),
				this.grad2d(this.p[p1], x - 1, y)
			),
			this.lerp(
				fx,
				this.grad2d(this.p[p0 + 1], x, y - 1),
				this.grad2d(this.p[p1 + 1], x - 1, y - 1)
			)
		);
	}
	noise(x, y) {
		let e = 1,
			k = 1,
			s = 0;
		for (let i = 0; i < this.octaves; ++i) {
			e *= 0.5;
			s += e * (1 + this.noise2d(k * x, k * y)) / 2;
			k *= 2;
		}
		return s;
	}
}

async function animationFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

let isRunning = false

async function run() {
  isRunning = true
	// init Pen
  const perlin = new Noise(3);
  const canvas = document.getElementById("noise-canvas");
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
	const ctx = canvas.getContext("2d")
	const zoom = 10 / Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
	ctx.lineWidth = 1;
	ctx.globalAlpha = 0.05;
	// main loop
	for (let px = -50; px < canvas.width; px += 5) {
    if(!isRunning){
      break
    }
		for (let py = -50; py < canvas.height / 6; py += 5) {
			let x = px;
			let y = Math.random() * canvas.height;
			ctx.beginPath();
			ctx.moveTo(x, y);
			const n = perlin.noise(x * zoom, y * zoom);
			// const m = (n-0.24) / 0.3
      // ORIG:
			// const c1 = { r: 241, g: 147, b: 92 }
      const c1 = { r: 201, g: 168, b: 126 }
			const c2 = { r: 186, g: 107, b: 87 }
			// const c1 = { r: 56, g: 85, b: 93 } // aegean blue 38555D
			// const c2 = { r: 115, g: 13, b: 38 } // burgundy 730D26
			// const c1 = { r: 232, g: 190, b: 51} //mustard e8be33 
			const r = (c1.r-c2.r) * m + c2.r
			const g = (c1.g-c2.g) * m + c2.g
			const b = (c1.b-c2.b) * m + c2.b
			ctx.strokeStyle = `rgb(${r},${g},${b}`;
			// const hue = -210 + n * 600
			// ctx.strokeStyle = `hsl(${hue}, 20%, ${600 * n * n * n }%)`;
			for (let m = 0; m < 600 && y >= 0 && y <= canvas.height; m++) {
				const n = perlin.noise(x * zoom, y * zoom);
				x += Math.cos(n * 14);
				y += Math.sin(n * 14);
				ctx.lineTo(x, y);
			}
			ctx.stroke();
		}
		await animationFrame();
	}
};

async function stop() {
  isRunning = false
}



export default {
  run,
  stop,
}
