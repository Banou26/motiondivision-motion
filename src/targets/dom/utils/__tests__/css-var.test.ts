import { registerCssVariable, registeredProperties } from "../css-var"

describe("registerCssVariable", () => {
  test("it registers new CSS properties", () => {
    expect(registeredProperties).not.toContain("--motion-x")
    registerCssVariable("--motion-x")
    expect(registeredProperties).toContain("--motion-x")
  })
})
