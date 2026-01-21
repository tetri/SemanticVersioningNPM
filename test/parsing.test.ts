import { describe, expect, test } from "vitest";

import { SemanticVersion } from "../src/semantic-version.js";

describe("Parsing", () => {
  test.each([
    ["1.2.3", 1, 2, 3, "", ""],
    ["1.0.0-alpha", 1, 0, 0, "alpha", ""],
    ["1.0.0-alpha.1", 1, 0, 0, "alpha.1", ""],
    ["1.0.0-0.3.7", 1, 0, 0, "0.3.7", ""],
    ["1.0.0-x.7.z.92", 1, 0, 0, "x.7.z.92", ""],
    ["1.0.0-alpha+001", 1, 0, 0, "alpha", "001"],
    ["1.0.0+20130313144700", 1, 0, 0, "", "20130313144700"],
  ])(
    "parse válido: %s",
    (versionString, major, minor, patch, prerelease, build) => {
      const version = new SemanticVersion(versionString);

      expect(version.major).toBe(major);
      expect(version.minor).toBe(minor);
      expect(version.patch).toBe(patch);
      expect(version.prerelease).toBe(prerelease);
      expect(version.build).toBe(build);
    }
  );

  test.each([
    "1",
    "1.2",
    "1.2.3-",
    "1.2.3-+build",
    "a.b.c",
    "1.0.0-alpha_beta",
    "1.0.0-alpha..1",
  ])("parse inválido lança erro: %s", (invalidVersion) => {
    expect(() => new SemanticVersion(invalidVersion)).toThrow(Error);
  });

  test.each(["1.0.0-01", "1.0.0-alpha.01"])(
    "prerelease inválido com zero à esquerda lança erro: %s",
    (invalidVersion) => {
      expect(() => new SemanticVersion(invalidVersion)).toThrow(Error);
    }
  );

  test("null lança TypeError", () => {
    expect(() => new SemanticVersion(null as any)).toThrow(TypeError);
  });

  test.each(["", " ", "\t", "\r\n"])(
    "whitespace lança erro: %j",
    (invalidVersion) => {
      expect(() => new SemanticVersion(invalidVersion)).toThrow(Error);
    }
  );
});

