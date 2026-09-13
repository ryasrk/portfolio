/**
 * react-spring's damped solver, reproduced.
 *
 * State is { value, velocity }, stepped at 1ms substeps up to a 64ms frame cap,
 * with `tension` and `friction` as given and mass fixed at 1. At rest when
 * |velocity| < 0.01 and |target - value| < 0.01 (0.001 for opacity-like ranges).
 */

const MAX_FRAME = 64;
const SUBSTEP = 1;

export class Spring {
  constructor({ tension = 170, friction = 26, precision = 0.01, from = 0 } = {}) {
    this.tension = tension;
    this.friction = friction;
    this.precision = precision;
    this.value = from;
    this.velocity = 0;
    this.target = from;
    this.resting = true;
  }

  set(target) {
    if (target !== this.target) {
      this.target = target;
      this.resting = false;
    }
    return this;
  }

  /** Snap with no motion — used on first discovery of a real value. */
  jump(value) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.resting = true;
    return this;
  }

  step(deltaMs) {
    if (this.resting) return this.value;

    // A tween config: { duration, easing } is applied immediately.
    let remaining = Math.min(deltaMs, MAX_FRAME);
    while (remaining > 0) {
      const dt = Math.min(SUBSTEP, remaining) / 1000;
      remaining -= SUBSTEP;
      const displacement = this.target - this.value;
      const springForce = this.tension * displacement;
      const damperForce = this.friction * this.velocity;
      // mass 1
      this.velocity += (springForce - damperForce) * dt;
      this.value += this.velocity * dt;
    }

    if (
      Math.abs(this.velocity) < this.precision &&
      Math.abs(this.target - this.value) < this.precision
    ) {
      this.value = this.target;
      this.velocity = 0;
      this.resting = true;
    }
    return this.value;
  }
}

/** The named configs the page bakes in. */
export const SPRING = {
  REVEAL:   { tension: 90,  friction: 26 },
  ROW:      { tension: 170, friction: 24 },
  ITEM:     { tension: 170, friction: 24 },
  SHEET:    { tension: 190, friction: 26 },
  FIGURE:   { tension: 200, friction: 24 },
  TYPE:     { tension: 210, friction: 24 },
  YEAR:     { tension: 190, friction: 24 },
  COPY:     { tension: 110, friction: 26 },
  COPY_FAST:{ tension: 150, friction: 24 },
  NAME:     { tension: 190, friction: 24 },
  VEIL:     { tension: 70,  friction: 24 },
  CLEAR:    { tension: 140, friction: 26 },
  LABEL:    { tension: 110, friction: 26 },
  PROGRESS_WAITING: { tension: 140, friction: 20 },
  PROGRESS_READY:   { tension: 240, friction: 22 },
  YEAR_SETTLE:      { tension: 32,  friction: 26 },
  TRIGGER:  { tension: 140, friction: 30 },
};
