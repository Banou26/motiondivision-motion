import { NextTime } from "../types"

export function calcNextTime(
  current: number,
  next: NextTime,
  prev: number,
  labels: Map<string, number>
): number {
  if (typeof next === "number") {
    return next
  } else if (next.startsWith("-") || next.startsWith("+")) {
    return Math.max(0, current + parseFloat(next))
  } else if (next === "<") {
    return prev
  } else {
    return labels.get(next) ?? current
  }
}
