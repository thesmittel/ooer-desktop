const hsl = {};
Object.defineProperties(hsl, {
    toHsv: {
        value: ({h,s,l}) => {
            const b = l + (s / 100) * Math.min(l, 100 - l);
            s = b === 0 ? 0 : 2 * (1 - l / b) * 100;
            return {h: h, s: s, v: b};
        },
        enumerable: false,
        configurable: false,
        writable: false
    },
    toRgb: {
        value: ({h,s,l}) => {
            s /= 100;
            l /= 100;
            const k = n => (n + h / 30) % 12;
            const a = s * Math.min(l, 1 - l);
            const f = n =>
              l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            return {r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4))};
        },
        enumerable: false,
        configurable: false,
        writable: false
    },
    toHex: {
        value: ({h,s,l}) => {Color.rgb.toHex(Color.hsl.toRgb({h:h,s:s,l:l}))},
        enumerable: false,
        configurable: false,
        writable: false
    }
})

const hsv = {}
Object.defineProperties(hsv, {
    toHsl: {
        value: ({h,s,v}) => {
            const l = (v / 100) * (100 - s / 2);
            s = l === 0 || l === 1 ? 0 : ((v - l) / Math.min(l, 100 - l)) * 100;
            return [h, s, l];
        },
        enumerable: false,
        configurable: false,
        writable: false
    },
    toRgb: {
        value: ({h,s,v}) => {
            s /= 100; v /= 100;
            const k = (n) => (n + h / 60) % 6;
            const f = (n) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
            return {r: Math.round(255 * f(5)), g: Math.round(255 * f(3)), b: Math.round(255 * f(1))};
        },
        enumerable: false,
        configurable: false,
        writable: false
    },
    toHex: {
        value: ({h,s,v}) => {
            let newRgb = Color.hsv.toRgb({h:h,s:s,v:v})
            const newHex = Color.rgb.toHex(newRgb)
            return newHex
        },
        enumerable: false,
        configurable: false,
        writable: false
    }
})

const rgb = {};
Object.defineProperties(rgb, {
    toHsl: {
        value: ({r,g,b}) => {
            r /= 255; g /= 255; b /= 255;
            const l = Math.max(r, g, b);
            const s = l - Math.min(r, g, b);
            const h = s
                ? l === r
                    ? (g - b) / s
                    : l === g
                        ? 2 + (b - r) / s
                        : 4 + (r - g) / s
                : 0;
            return {
                h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
                s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
                l: (100 * (2 * l - s)) / 2,
            };
        },
        enumerable: false,
        configurable: false,
        writable: false
    },
    toHsv: {
        value: ({r,g,b}) => {
            r /= 255; g /= 255; b /= 255;
            const v = Math.max(r, g, b),
                n = v - Math.min(r, g, b);
            const h =
                n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
            return {h: 60 * (h < 0 ? h + 6 : h), s: v && (n / v) * 100, v: v * 100};
        },
        enumerable: false,
        configurable: false,
        writable: false
    }, 
    toHex: {
        value: ({r,g,b}) => {
            if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 ) throw new RangeError("Color channel values must be between 0 and 255 inclusive.")
            const ret = ("0" + Math.round(r).toString(16)).slice(-2) + ("0" + Math.round(g).toString(16)).slice(-2) + ("0" + Math.round(b).toString(16)).slice(-2);
            return ret
        },
        enumerable: false,
        configurable: false,
        writable: false
    }
})

const hex = {};
Object.defineProperties(hex, {
    toHsl: {
        value: c => {return Color.rgb.toHsl(Color.hex.toRgb(c))},
        enumerable: false,
        configurable: false,
        writable: false
    },
    toHsv: {
        value: c => {const t = Color.rgb.toHsv(Color.hex.toRgb(c)); return t},
        enumerable: false,
        configurable: false,
        writable: false
    },
    toRgb: {
        value: c => {
            if (!c.match(/^[0-9a-fA-F]{6}$/g)) throw new Error("Hex color must be a 6 digit hexadecimal number. No '#', '0x' or other prefixes.")
            return {
                r: parseInt(c.slice(0,2), 16),
                g: parseInt(c.slice(2,4), 16),
                b: parseInt(c.slice(4,6), 16)
            }
        },
        enumerable: false,
        configurable: false,
        writable: false
    }
})

const Color = {}
Object.defineProperties(Color, {
	hsl: {
		value: hsl,
		enumerable: false,
		configurable: false,
		writable: false
	},
	hsv: {
		value: hsv,
		enumerable: false,
		configurable: false,
		writable: false
	},
	rgb: {
		value: rgb,
		enumerable: false,
		configurable: false,
		writable: false
	},
	hex: {
		value: hex,
		enumerable: false,
		configurable: false,
		writable: false
	},
})

export {Color}