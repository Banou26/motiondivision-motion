import { velocityPerSecond } from "popmotion"
import { AnimationGenerator } from "./types"

const defaultStiffness = 100.0
const defaultDamping = 10.0
const defaultMass = 1.0

export const calcDampingRatio = (
  stiffness = defaultStiffness,
  damping = defaultDamping,
  mass = defaultMass
): number => damping / (2 * Math.sqrt(stiffness * mass))

export const calcAngularFreq = (undampedFreq: number, dampingRatio: number) =>
  undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio)

export const spring = ({
  stiffness = defaultStiffness,
  damping = 10.0,
  mass = 1.0,
  from = 0,
  to = 1,
  velocity = 0.0,
  restSpeed = 2,
  restDelta = 0.1,
} = {}): AnimationGenerator => {
  velocity = velocity ? -(velocity / 1000) : 0.0
  const dampingRatio = calcDampingRatio(stiffness, damping, mass)
  const initialDelta = to - from
  const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1000
  const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio)

  const state = {
    done: false,
    value: from,
    velocity,
  }

  let resolveSpring: (t: number) => number
  if (dampingRatio < 1) {
    // Underdamped spring (bouncy)
    resolveSpring = (t) =>
      to -
      Math.exp(-dampingRatio * undampedAngularFreq * t) *
        (((-velocity + dampingRatio * undampedAngularFreq * initialDelta) /
          angularFreq) *
          Math.sin(angularFreq * t) +
          initialDelta * Math.cos(angularFreq * t))
  } else {
    // Critically damped spring
    resolveSpring = (t) =>
      to -
      Math.exp(-undampedAngularFreq * t) *
        (initialDelta + (velocity + undampedAngularFreq * initialDelta) * t)
  }

  return {
    next: (t: number) => {
      state.value = resolveSpring(t)
      state.velocity =
        t === 0 ? velocity : calcVelocity(resolveSpring, t, state.value)
      const isBelowVelocityThreshold = Math.abs(state.velocity) <= restSpeed
      const isBelowDisplacementThreshold =
        Math.abs(to - state.value) <= restDelta
      state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold

      return state
    },
  }
}

const sampleT = 5 // ms
function calcVelocity(
  resolveValue: (v: number) => number,
  t: number,
  current: number
) {
  const prevT = Math.max(t - sampleT, 0)
  return velocityPerSecond(current - resolveValue(prevT), 5)
}
