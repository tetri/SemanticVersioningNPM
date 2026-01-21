import { describe, expect, test } from "vitest";

import { SemanticVersion } from "../src/semantic-version.js";

describe("Operators/Comparison", () => {
  test.each([
    ["1.0.0", "1.0.0", true],
    ["1.0.0", "2.0.0", false],
  ])("equals (%s == %s) => %s", (v1, v2, expected) => {
    const version1 = new SemanticVersion(v1);
    const version2 = new SemanticVersion(v2);

    expect(version1.equals(version2)).toBe(expected);
  });

  test.each([
    ["1.0.0", "1.0.0", false],
    ["1.0.0", "2.0.0", true],
  ])("not equals (%s != %s) => %s", (v1, v2, expected) => {
    const version1 = new SemanticVersion(v1);
    const version2 = new SemanticVersion(v2);

    expect(!version1.equals(version2)).toBe(expected);
  });

  test.each([
    ["1.0.0", "2.0.0", true],
    ["2.0.0", "1.0.0", false],
    ["1.0.0", "1.0.0", false],
  ])("lt (%s < %s) => %s", (v1, v2, expected) => {
    const version1 = new SemanticVersion(v1);
    const version2 = new SemanticVersion(v2);

    expect(version1.lt(version2)).toBe(expected);
  });

  test.each([
    ["2.0.0", "1.0.0", true],
    ["1.0.0", "2.0.0", false],
    ["1.0.0", "1.0.0", false],
  ])("gt (%s > %s) => %s", (v1, v2, expected) => {
    const version1 = new SemanticVersion(v1);
    const version2 = new SemanticVersion(v2);

    expect(version1.gt(version2)).toBe(expected);
  });

  test.each([
    ["1.0.0", "1.0.0", true],
    ["1.0.0", "2.0.0", true],
    ["2.0.0", "1.0.0", false],
  ])("lte (%s <= %s) => %s", (v1, v2, expected) => {
    const version1 = new SemanticVersion(v1);
    const version2 = new SemanticVersion(v2);

    expect(version1.lte(version2)).toBe(expected);
  });

  test.each([
    ["1.0.0", "1.0.0", true],
    ["2.0.0", "1.0.0", true],
    ["1.0.0", "2.0.0", false],
  ])("gte (%s >= %s) => %s", (v1, v2, expected) => {
    const version1 = new SemanticVersion(v1);
    const version2 = new SemanticVersion(v2);

    expect(version1.gte(version2)).toBe(expected);
  });
});

