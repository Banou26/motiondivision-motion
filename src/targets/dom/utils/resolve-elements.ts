import { AcceptedElements } from "../types"

export function resolveElements(
  elements: AcceptedElements,
  selectorCache?: { [key: string]: NodeListOf<Element> }
): Element[] {
  if (typeof elements === "string") {
    if (selectorCache) {
      selectorCache[elements] ??= document.querySelectorAll(elements)
      elements = selectorCache[elements]
    } else {
      elements = document.querySelectorAll(elements)
    }
  } else if (elements instanceof Element) {
    elements = [elements]
  }

  return Array.from(elements)
}
