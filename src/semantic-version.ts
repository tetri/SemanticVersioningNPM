const VERSION_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][a-zA-Z0-9-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][a-zA-Z0-9-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export class SemanticVersion {
  public readonly major: number;
  public readonly minor: number;
  public readonly patch: number;
  public readonly prerelease: string;
  public readonly build: string;

  constructor();
  constructor(version: string);
  constructor(
    major: number,
    minor: number,
    patch: number,
    prerelease?: string,
    build?: string
  );
  constructor(
    arg0?: string | number,
    minor?: number,
    patch?: number,
    prerelease: string = "",
    build: string = ""
  ) {
    if (arg0 === null) {
      // compat: C# lança ArgumentNullException; aqui usamos TypeError
      throw new TypeError("version is null");
    }

    // new SemanticVersion()
    if (typeof arg0 === "undefined") {
      this.major = 0;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = "";
      this.build = "";
      return;
    }

    // new SemanticVersion("1.2.3-alpha+build")
    if (typeof arg0 === "string") {
      const version = arg0;
      if (version.trim().length === 0) {
        throw new Error("Invalid semantic version format");
      }

      const match = VERSION_REGEX.exec(version);
      if (!match) {
        throw new Error("Invalid semantic version format");
      }

      this.major = Number.parseInt(match[1], 10);
      this.minor = Number.parseInt(match[2], 10);
      this.patch = Number.parseInt(match[3], 10);
      this.prerelease = match[4] ?? "";
      this.build = match[5] ?? "";
      return;
    }

    // new SemanticVersion(major, minor, patch, prerelease?, build?)
    this.major = arg0;
    this.minor = minor ?? 0;
    this.patch = patch ?? 0;
    this.prerelease = prerelease ?? "";
    this.build = build ?? "";
  }

  public toString(): string {
    let version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length > 0) {
      version += `-${this.prerelease}`;
    }
    if (this.build.length > 0) {
      version += `+${this.build}`;
    }
    return version;
  }

  /**
   * JSON.stringify(new SemanticVersion("1.2.3")) => "\"1.2.3\""
   */
  public toJSON(): string {
    return this.toString();
  }

  public compareTo(other: SemanticVersion): number {
    const majorComparison = this.major - other.major;
    if (majorComparison !== 0) return Math.sign(majorComparison);

    const minorComparison = this.minor - other.minor;
    if (minorComparison !== 0) return Math.sign(minorComparison);

    const patchComparison = this.patch - other.patch;
    if (patchComparison !== 0) return Math.sign(patchComparison);

    return SemanticVersion.comparePreRelease(this.prerelease, other.prerelease);
  }

  public equals(other: SemanticVersion): boolean {
    return this.compareTo(other) === 0;
  }

  public lt(other: SemanticVersion): boolean {
    return this.compareTo(other) < 0;
  }
  public lte(other: SemanticVersion): boolean {
    return this.compareTo(other) <= 0;
  }
  public gt(other: SemanticVersion): boolean {
    return this.compareTo(other) > 0;
  }
  public gte(other: SemanticVersion): boolean {
    return this.compareTo(other) >= 0;
  }

  public static compare(a: SemanticVersion, b: SemanticVersion): number {
    return a.compareTo(b);
  }

  public static parse(version: string): SemanticVersion {
    return new SemanticVersion(version);
  }

  public static fromJSON(json: string): SemanticVersion {
    const parsed = JSON.parse(json) as unknown;
    if (parsed === null) {
      throw new Error("Cannot deserialize null into SemanticVersion.");
    }
    if (typeof parsed !== "string") {
      throw new Error("Invalid SemanticVersion JSON value.");
    }
    return new SemanticVersion(parsed);
  }

  private static comparePreRelease(left: string, right: string): number {
    if (left.length === 0 && right.length === 0) return 0;
    if (left.length === 0) return 1;
    if (right.length === 0) return -1;

    const leftParts = left.split(".");
    const rightParts = right.split(".");
    const minLength = Math.min(leftParts.length, rightParts.length);

    for (let i = 0; i < minLength; i++) {
      const leftPart = leftParts[i]!;
      const rightPart = rightParts[i]!;

      const leftIsNumeric = /^[0-9]+$/.test(leftPart);
      const rightIsNumeric = /^[0-9]+$/.test(rightPart);
      const leftNum = leftIsNumeric ? Number(leftPart) : NaN;
      const rightNum = rightIsNumeric ? Number(rightPart) : NaN;

      if (leftIsNumeric && rightIsNumeric) {
        const comparison = leftNum - rightNum;
        if (comparison !== 0) return Math.sign(comparison);
      } else if (leftIsNumeric) {
        return -1;
      } else if (rightIsNumeric) {
        return 1;
      } else {
        if (leftPart < rightPart) return -1;
        if (leftPart > rightPart) return 1;
      }
    }

    const lengthComparison = leftParts.length - rightParts.length;
    return Math.sign(lengthComparison);
  }
}

