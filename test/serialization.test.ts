import { describe, expect, test } from "vitest";

import { SemanticVersion } from "../src/semantic-version.js";

describe("Serialization", () => {
  test("consegue fazer round-trip com JSON (string)", () => {
    const original = new SemanticVersion("1.2.3-alpha.1+build");
    const json = JSON.stringify(original);
    const deserialized = SemanticVersion.fromJSON(json);

    expect(deserialized.equals(original)).toBe(true);
  });

  test("deserializar null lança erro", () => {
    expect(() => SemanticVersion.fromJSON("null")).toThrow(Error);
  });
});

