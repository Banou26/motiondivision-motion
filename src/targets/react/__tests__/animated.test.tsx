import {
  pointerDown,
  pointerUp,
  pointerEnter,
  pointerLeave,
  render,
} from "../../../../jest.setup"
import { animated } from "../"
import { AnimatePresence } from "framer-motion"
import "../../dom/__tests__/web-animations.min-edited"
import * as React from "react"

console.error = jest.fn()

const duration = 0.001

/**
 * TODO: Where first/last value is null
 */

describe("animated", () => {
  test("Types are correct", async () => {
    const promise = new Promise((resolve) => {
      const Component = () => (
        <animated.div>
          <animated.svg></animated.svg>
          <animated.a></animated.a>
        </animated.div>
      )

      const { rerender } = render(<Component />)
      rerender(<Component />)

      setTimeout(() => resolve(true), 0)
    })

    return expect(promise).resolves.toBe(true)
  })

  test("No animation runs on mount if no initial is defined", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          style={{ opacity: [0, 0.8] }}
          onComplete={() => reject(false)}
          options={{ duration }}
        />
      )

      const { rerender } = render(<Component />)
      rerender(<Component />)

      setTimeout(() => resolve(true), 50)
    })

    return expect(promise).resolves.toBe(true)
  })

  test("Animation runs on mount if initial is defined and is different", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          initial={{ opacity: 0.4 }}
          style={{ opacity: [0, 0.8] }}
          onComplete={() => resolve(true)}
          options={{ duration }}
        />
      )

      const { rerender } = render(<Component />)
      rerender(<Component />)

      setTimeout(() => reject(false), 100)
    })

    return expect(promise).resolves.toBe(true)
  })

  test("Style props can accept options override", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          initial={{ opacity: 0.4 }}
          style={{ opacity: [0, 0.8], options: { duration } }}
          onComplete={() => resolve(true)}
          options={{ duration: 100 }}
        />
      )

      const { rerender } = render(<Component />)
      rerender(<Component />)

      setTimeout(() => reject(false), 100)
    })

    return expect(promise).resolves.toBe(true)
  })

  test("Animation doesn't run on mount if initial and style define different values", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          initial={{ backgroundColor: "black" }}
          style={{ opacity: [0, 0.8] }}
          onComplete={() => reject(false)}
          options={{ duration }}
        />
      )

      const { rerender } = render(<Component />)
      rerender(<Component />)

      setTimeout(() => resolve(true), 50)
    })

    return expect(promise).resolves.toBe(true)
  })

  test("Animation runs when style changes", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = ({ opacity }: { opacity: number[] }) => (
        <animated.div
          style={{ opacity }}
          onComplete={(animation) => resolve(animation)}
          options={{ duration }}
        />
      )

      const { rerender } = render(<Component opacity={[0, 0.8]} />)
      rerender(<Component opacity={[0, 0.9]} />)

      setTimeout(() => reject(false), 100)
    })

    return expect(promise).resolves.toEqual({ opacity: [0, 0.9] })
  })

  test("Animation doesn't run when style stays the same", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = ({ opacity }: { opacity: number[] }) => (
        <animated.div
          style={{ opacity }}
          onComplete={() => reject(false)}
          options={{ duration }}
        />
      )

      const { rerender } = render(<Component opacity={[0, 0.8]} />)
      rerender(<Component opacity={[0, 0.8]} />)

      setTimeout(() => resolve(true), 50)
    })

    return expect(promise).resolves.toEqual(true)
  })

  test("Values animate to hover when hover starts", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          hover={{ opacity: 0.3 }}
          options={{ duration }}
          style={{ opacity: 0 }}
          onComplete={(animation) => resolve(animation)}
        />
      )

      const { container, rerender } = render(<Component />)
      rerender(<Component />)

      pointerEnter(container.firstChild as Element)
      setTimeout(() => reject(), 100)
    })

    return expect(promise).resolves.toEqual({ opacity: 0.3 })
  })

  test("Hover accepts options", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          hover={{ opacity: 0.3, options: { duration } }}
          options={{ duration: 100 }}
          style={{ opacity: 0 }}
          onComplete={(animation) => resolve(animation)}
        />
      )

      const { container, rerender } = render(<Component />)
      rerender(<Component />)

      pointerEnter(container.firstChild as Element)
      setTimeout(() => reject(), 100)
    })

    return expect(promise).resolves.toEqual({ opacity: 0.3 })
  })

  test("Values animate back to style/initial when hover ends", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          hover={{ opacity: [0.2, 0.3] }}
          options={{ duration }}
          style={{ opacity: [0, 0.2] }}
          onComplete={(animation) => resolve(animation)}
        />
      )

      const { container, rerender } = render(<Component />)
      rerender(<Component />)

      pointerEnter(container.firstChild as Element)
      setTimeout(() => {
        pointerLeave(container.firstChild as Element)
      }, 10)
      setTimeout(() => reject(), 100)
    })

    return expect(promise).resolves.toEqual({ opacity: [0, 0.2] })
  })

  test("Values animate to press when press starts", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          press={{ opacity: [0.2, 0.3] }}
          options={{ duration }}
          style={{ opacity: [0, 0.2] }}
          onComplete={(animation) => resolve(animation)}
        />
      )

      const { container, rerender } = render(<Component />)
      rerender(<Component />)

      pointerDown(container.firstChild as Element)
      setTimeout(() => reject(), 50)
    })

    return expect(promise).resolves.toEqual({ opacity: [0.2, 0.3] })
  })

  test("Press accepts options", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          press={{ opacity: [0.2, 0.3], options: { duration } }}
          options={{ duration: 100 }}
          style={{ opacity: [0, 0.2] }}
          onComplete={(animation) => resolve(animation)}
        />
      )

      const { container, rerender } = render(<Component />)
      rerender(<Component />)

      pointerDown(container.firstChild as Element)
      setTimeout(() => reject(), 50)
    })

    return expect(promise).resolves.toEqual({ opacity: [0.2, 0.3] })
  })

  test("Values animate back to style/initial/hover when press ends", async () => {
    const promise = new Promise((resolve, reject) => {
      const Component = () => (
        <animated.div
          press={{ opacity: [0.2, 0.3] }}
          options={{ duration: 0.2 }}
          style={{ opacity: [0, 0.2] }}
          onComplete={(animation) => resolve(animation)}
        />
      )

      const { container, rerender } = render(<Component />)
      rerender(<Component />)

      pointerDown(container.firstChild as Element)
      setTimeout(() => {
        pointerUp(container.firstChild as Element)
      }, 50)
      setTimeout(() => reject(false), 500)
    })

    return expect(promise).resolves.toEqual({ opacity: [0, 0.2] })
  })

  test("Animates out a component when its removed", async () => {
    const promise = new Promise<Element | null>((resolve) => {
      const Component = ({ isVisible }: { isVisible: boolean }) => {
        return (
          <AnimatePresence>
            {isVisible && (
              <animated.div
                exit={{ opacity: [1, 0] }}
                options={{ duration }}
                style={{ opacity: [0, 1] }}
              />
            )}
          </AnimatePresence>
        )
      }

      const { container, rerender } = render(<Component isVisible />)
      rerender(<Component isVisible />)
      rerender(<Component isVisible={false} />)
      rerender(<Component isVisible={false} />)

      // Check it's gone
      setTimeout(() => {
        resolve(container.firstChild as Element | null)
      }, 150)
    })

    const child = await promise
    expect(child).toBeFalsy()
  })
})
