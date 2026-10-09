/**
 * Shared, mutable choreography state between the scroll timeline (GSAP) and the
 * WebGL cloth. Written by ScrollTriggers, read every frame by SilkCanvas — kept
 * outside React so scrolling never triggers a re-render.
 *
 * x / y are in viewport units: -1 = left/bottom edge, 1 = right/top edge.
 */
export interface StageTarget {
  x: number;
  y: number;
  /** tilt of the hand-held top edge (radians, around z) */
  tilt: number;
  /** swing of the top edge around the vertical axis (radians) */
  turn: number;
  /** wind multiplier */
  wind: number;
  /** fabric index as a float — fractional values blend two fabrics */
  fabric: number;
}

export const stage: StageTarget & { velocity: number; ready: boolean } = {
  x: 0.35,
  y: 3.2, // starts above the viewport, drops in after the preloader
  tilt: 0.12,
  turn: -0.35,
  wind: 1,
  fabric: 0,
  velocity: 0,
  ready: false,
};

export function setStage(t: Partial<StageTarget>) {
  Object.assign(stage, t);
}
