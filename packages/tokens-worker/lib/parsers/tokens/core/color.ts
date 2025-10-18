// This file were developed with the assistance of AI tools.
//
import Color from 'color';

import type { ParseValueOptions } from '../types.js';
import type { TokenResolver } from './resolver.js';

export interface ColorToolkitConfig {
  resolver: TokenResolver;
  defaultParseOptions: ParseValueOptions;
  verbose: boolean;
}

export class ColorToolkit {
  private readonly resolver: TokenResolver;
  private readonly defaultParseOptions: ParseValueOptions;
  private readonly verbose: boolean;

  constructor({ resolver, defaultParseOptions, verbose }: ColorToolkitConfig) {
    this.resolver = resolver;
    this.defaultParseOptions = defaultParseOptions;
    this.verbose = Boolean(verbose);
  }

  public tryParseColor(value: string, unitForFormat?: string): string | null {
    const raw = value.trim();

    const okHex = this.parseOKStringToHex(raw);
    if (okHex) return this.formatColor(Color(okHex), unitForFormat);

    const resolved = raw.startsWith('{')
      ? String(this.resolver.parseNestedValue(raw, this.defaultParseOptions))
      : raw;

    const direct = this.tryToColor(resolved);
    if (direct) return this.formatColor(direct, unitForFormat);

    const exprColor = this.evaluateColorExpression(resolved);
    if (exprColor) return this.formatColor(exprColor, unitForFormat);

    if (/\{[^}]+\}/.test(resolved)) {
      const withRefsResolved = resolved.replace(/\{[^}]+\}/g, (m) =>
        String(this.resolver.parseNestedValue(m, this.defaultParseOptions)),
      );

      const direct2 = this.tryToColor(withRefsResolved);
      if (direct2) return this.formatColor(direct2, unitForFormat);

      const exprColor2 = this.evaluateColorExpression(withRefsResolved);
      if (exprColor2) return this.formatColor(exprColor2, unitForFormat);
    }

    return null;
  }

  public contrastRatio(fg: string, bg: string): number {
    const f = this.tryToColor(fg),
      b = this.tryToColor(bg);
    if (!f || !b) return 1;
    const frgb = f.rgb().array() as [number, number, number];
    const brgb = b.rgb().array() as [number, number, number];
    const L1 = this.relLuminance(frgb);
    const L2 = this.relLuminance(brgb);
    const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
    return (hi + 0.05) / (lo + 0.05);
  }

  public pickReadable(fg1: string, fg2: string, bg: string, target = 4.5): string {
    if (this.contrastRatio(fg1, bg) >= target) return fg1;
    if (this.contrastRatio(fg2, bg) >= target) return fg2;

    const [L, C, H] = this.colorToOklch(fg1);
    const up = this.contrastRatio(this.oklchToHex([this.clamp01(L + 0.12), C, H]), bg);
    const dn = this.contrastRatio(this.oklchToHex([this.clamp01(L - 0.12), C, H]), bg);
    const dir = up >= dn ? +1 : -1;

    let best = fg1;
    let bestC = this.contrastRatio(fg1, bg);
    for (let i = 1; i <= 12; i++) {
      const L2 = this.clamp01(L + dir * (i * 0.01));
      const cand = this.oklchToHex([L2, C, H]);
      const c = this.contrastRatio(cand, bg);
      if (c > bestC) {
        best = cand;
        bestC = c;
        if (c >= target) break;
      }
    }
    return best;
  }

  private oklchToHex([L, C, H]: [number, number, number]): string {
    const rgb = this.oklabToRgb(this.oklchToOklab([L, C, H]));
    return Color.rgb(rgb[0], rgb[1], rgb[2]).hex().toLowerCase();
  }

  public mixOKLCH(aHex: string, bHex: string, t: number): string {
    const A = this.colorToOklch(aHex);
    const B = this.colorToOklch(bHex);
    const [La, Ca, Ha] = A;
    const [Lb, Cb, Hb] = B;

    let dH = Hb - Ha;
    if (dH > 180) dH -= 360;
    if (dH < -180) dH += 360;

    const L = this.lerp(La, Lb, t);
    const C = this.lerp(Ca, Cb, t);
    const H = Ha + dH * t;

    const rgb = this.oklabToRgb(this.oklchToOklab([L, C, this.mod(H, 360)]));
    return Color.rgb(rgb[0], rgb[1], rgb[2]).hex().toLowerCase();
  }

  public relShiftLOKLCH(colorStr: string, deltaL: number): string {
    const [L, C, H] = this.colorToOklch(colorStr);
    const L2 = this.clamp01(L - deltaL);
    const rgb = this.oklabToRgb(this.oklchToOklab([L2, C, H]));
    return Color.rgb(rgb[0], rgb[1], rgb[2]).hex().toLowerCase();
  }

  /* Internal helpers ---------------------------------------------------------------------- */

  private evaluateColorExpression(expr: string): ReturnType<typeof Color> | null {
    let s = expr.trim();

    const plain = this.tryToColor(s);
    if (plain) return plain;

    const fnMatch = /^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/.exec(s);
    if (!fnMatch) {
      const okHex = this.parseOKStringToHex(s);
      if (okHex) return this.tryToColor(okHex);
      return null;
    }

    const fn = fnMatch[1].toLowerCase();
    const argsStr = fnMatch[2];

    const args: string[] = [];
    let buf = '';
    let depth = 0;
    for (let i = 0; i < argsStr.length; i++) {
      const ch = argsStr[i];
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        args.push(buf.trim());
        buf = '';
      } else {
        buf += ch;
      }
    }
    if (buf.trim().length) args.push(buf.trim());

    const resolveColorArg = (arg: string): ReturnType<typeof Color> | null => {
      const resolved = arg.startsWith('{')
        ? this.resolver.parseNestedValue(arg, this.defaultParseOptions)
        : arg;

      const okHex = this.parseOKStringToHex(String(resolved));
      if (okHex) return this.tryToColor(okHex);
      return this.tryToColor(String(resolved).trim());
    };

    const resolveMaybeFunction = (arg: string): ReturnType<typeof Color> | null => {
      const direct = resolveColorArg(arg);
      if (direct) return direct;
      const inner = this.evaluateColorExpression(arg);
      if (inner) return inner;
      return null;
    };

    let out: ReturnType<typeof Color> | null = null;
    const amount = (arg: string) => this.parseAmount(arg);
    const fnKey = fn.toLowerCase();

    switch (fnKey) {
      case 'rgba': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const alpha = amount(args[1]);
        out = base.alpha(alpha);
        break;
      }
      case 'lighten':
      case 'darken': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = amount(args[1]);
        out = fnKey === 'lighten' ? base.lighten(amt) : base.darken(amt);
        break;
      }
      case 'lightness': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = amount(args[1]);
        if (amt === 0) return base;
        return amt > 0 ? base.lighten(amt) : base.darken(-amt);
      }
      case 'shift_oklch': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const delta = amount(args[1]);
        const shifted = this.shiftOKLCH(base.hex().toString(), delta);
        return this.tryToColor(shifted);
      }
      case 'saturate':
      case 'desaturate': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = amount(args[1]);
        out = fnKey === 'saturate' ? base.saturate(amt) : base.desaturate(amt);
        break;
      }
      case 'fade':
      case 'transparentize': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = amount(args[1]);
        out = base.fade(amt);
        break;
      }
      case 'mix': {
        if (args.length < 2 || args.length > 3) return null;
        const A = resolveMaybeFunction(args[0]);
        const B = resolveMaybeFunction(args[1]);
        if (!A || !B) return null;

        const t = args[2] != null ? parseFloat(args[2]) : 0.5;
        const hex = this.mixOKLCH(
          A.hex().toString(),
          B.hex().toString(),
          Math.max(0, Math.min(1, t)),
        );
        return this.tryToColor(hex);
      }
      case 'on_contrast': {
        if (args.length < 3 || args.length > 4) return null;
        const FG1 = resolveMaybeFunction(args[0]);
        if (!FG1) return null;
        const FG2 = resolveMaybeFunction(args[1]);
        if (!FG2) return null;
        const BG = resolveMaybeFunction(args[2]);
        if (!BG) return null;
        const target = args[3] != null ? parseFloat(args[3]) : 4.5;
        const chosen = this.pickReadable(
          FG1.hex().toString(),
          FG2.hex().toString(),
          BG.hex().toString(),
          target,
        );
        return this.tryToColor(chosen);
      }
      default:
        return null;
    }

    return out;
  }

  private tryToColor(value: string): ReturnType<typeof Color> | null {
    try {
      const parsed = Color(value);
      if (!parsed) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private parseAmount(input: string): number {
    const trimmed = input.trim();
    if (trimmed.endsWith('%')) {
      const pct = parseFloat(trimmed.slice(0, -1));
      return pct / 100;
    }
    return parseFloat(trimmed);
  }

  private shiftOKLCH(colorStr: string, deltaL: number): string {
    const [L, C, H] = this.colorToOklch(colorStr);
    const shifted = [this.clamp01(L + deltaL), C, H] as [number, number, number];
    const rgb = this.oklabToRgb(this.oklchToOklab(shifted));
    return Color.rgb(rgb[0], rgb[1], rgb[2]).hex().toLowerCase();
  }

  private parseOKStringToHex(raw: string): string | null {
    const s = raw.trim().toLowerCase();
    const okLCH = /^oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([\-0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)$/;
    const okLAB = /^oklab\(\s*([0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)$/;

    let m = okLCH.exec(s);
    if (m) {
      const L = parseFloat(m[1]);
      const C = parseFloat(m[2]);
      const H = parseFloat(m[3]);
      const [R, G, B] = this.oklabToRgb(this.oklchToOklab([L, C, H]));
      const base = Color.rgb(R, G, B);
      const a = m[4] != null ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 1;
      return (a < 1 ? base.alpha(a).hexa() : base.hex()).toLowerCase();
    }
    m = okLAB.exec(s);
    if (m) {
      const L = parseFloat(m[1]);
      const A = parseFloat(m[2]);
      const B = parseFloat(m[3]);
      const [R, G, Bc] = this.oklabToRgb([L, A, B]);
      const base = Color.rgb(R, G, Bc);
      const a = m[4] != null ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 1;
      return (a < 1 ? base.alpha(a).hexa() : base.hex()).toLowerCase();
    }
    return null;
  }

  private formatColor(c: ReturnType<typeof Color>, unit?: string): string {
    const fmt = this.normalizeUnit(unit);
    const a = c.alpha();

    switch (fmt) {
      case 'rgba':
        return c.rgb().string();
      case 'rgb':
        return `rgb(${c
          .rgb()
          .array()
          .map((x) => Math.round(x))
          .join(', ')})`;
      case 'hsla':
        return c.hsl().string();
      case 'hsl':
        return `hsl(${c
          .hsl()
          .array()
          .map((x, i) => (i === 0 ? Math.round(x) : Math.round(x)))
          .join(', ')})`;
      case 'lab':
      case 'laba':
        return `${fmt === 'laba' ? 'lab' : 'lab'}(${c.lab().array().join(' ')})${
          fmt === 'laba' ? `/${a}` : ''
        }`;
      case 'oklch':
      case 'oklab':
        return this.formatOkColor(c, fmt, a);
      default:
        return a < 1 ? c.alpha(a).hexa().toLowerCase() : c.hex().toLowerCase();
    }
  }

  private normalizeUnit(u?: string): string {
    const unit = (u ?? '').trim().toLowerCase();
    if (unit === '' || unit === 'none' || unit === 'hex') return 'hex';
    if (unit === 'rgba') return 'rgba';
    if (unit === 'rgb') return 'rgb';
    if (unit === 'hsla') return 'hsla';
    if (unit === 'hsl') return 'hsl';
    if (unit === 'laba') return 'laba';
    if (unit === 'lab') return 'lab';
    if (unit === 'oklch' || unit === 'oklcha') return 'oklch';
    if (unit === 'oklab' || unit === 'oklaba') return 'oklab';
    return 'hex';
  }

  private formatOkColor(
    color: ReturnType<typeof Color>,
    target: 'oklch' | 'oklab',
    alpha: number,
  ): string {
    const rgb = color.rgb().array() as [number, number, number];
    const ok = target === 'oklch' ? this.oklabToOklch(this.rgbToOKLab(rgb)) : this.rgbToOKLab(rgb);
    const formatter = target === 'oklch' ? this.formatOklch : this.formatOklab;
    return formatter(ok, alpha);
  }

  private formatOklch([L, C, H]: [number, number, number], alpha: number): string {
    const base = `oklch(${this.round(L)} ${this.round(C)} ${this.round(H)})`;
    return alpha < 1 ? `${base} / ${this.round(alpha)}` : base;
  }

  private formatOklab([L, A, B]: [number, number, number], alpha: number): string {
    const base = `oklab(${this.round(L)} ${this.round(A)} ${this.round(B)})`;
    return alpha < 1 ? `${base} / ${this.round(alpha)}` : base;
  }

  private rgbToOKLab([r8, g8, b8]: [number, number, number]): [number, number, number] {
    const r = this.srgbToLinear(r8 / 255);
    const g = this.srgbToLinear(g8 / 255);
    const b = this.srgbToLinear(b8 / 255);

    const l = 0.412165612 * r + 0.536275208 * g + 0.0514575653 * b;
    const m = 0.211859107 * r + 0.680718958 * g + 0.107406579 * b;
    const s = 0.0883097947 * r + 0.281847417 * g + 0.630261361 * b;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
    return [L, A, B];
  }

  private oklabToRgb([L, A, B]: [number, number, number]): [number, number, number] {
    const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
    const s_ = L - 0.0894841775 * A - 1.291485548 * B;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    const R = Math.round(this.linearToSrgb(r) * 255);
    const G = Math.round(this.linearToSrgb(g) * 255);
    const Bc = Math.round(this.linearToSrgb(b) * 255);
    return [this.clampTo8(R), this.clampTo8(G), this.clampTo8(Bc)];
  }

  private oklabToOklch([L, A, B]: [number, number, number]): [number, number, number] {
    const C = Math.hypot(A, B);
    const H = this.mod(this.deg(Math.atan2(B, A)), 360);
    return [L, C, H];
  }

  private oklchToOklab([L, C, H]: [number, number, number]): [number, number, number] {
    const a = C * Math.cos(this.rad(H));
    const b = C * Math.sin(this.rad(H));
    return [L, a, b];
  }

  private colorToOklch(colorStr: string): [number, number, number] {
    const col = this.tryToColor(colorStr);
    if (!col) return [0, 0, 0];
    const { r, g, b } = col.rgb().object();
    return this.oklabToOklch(this.rgbToOKLab([r, g, b]));
  }

  private relLuminance(rgb255: [number, number, number]) {
    const [r8, g8, b8] = rgb255;
    const rl = this.srgbToLinear(r8);
    const gl = this.srgbToLinear(g8);
    const bl = this.srgbToLinear(b8);
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
  }

  private srgbToLinear(v: number) {
    const val = v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return val;
  }

  private linearToSrgb(v: number) {
    const val = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return val;
  }

  private clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
  }

  private clampTo8(v: number) {
    return Math.max(0, Math.min(255, v | 0));
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  private deg(radians: number) {
    return (radians * 180) / Math.PI;
  }

  private rad(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  private mod(value: number, modulo: number) {
    return ((value % modulo) + modulo) % modulo;
  }

  private round(value: number) {
    return parseFloat(value.toFixed(4));
  }
}
