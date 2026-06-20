/**
 * Verifies that en.json and ar.json have exactly the same set of keys
 * at every nesting level. Any key present in one but missing from the
 * other will cause this test to fail — add the missing translation
 * rather than weakening the test.
 */

import { describe, it, expect } from "vitest";
import en from "./en.json";
import ar from "./ar.json";

type JsonObject = Record<string, unknown>;

/** Recursively collects all dotted key paths from a JSON object. */
function collectKeys(obj: JsonObject, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectKeys(value as JsonObject, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

describe("message catalog parity", () => {
  const enKeys = collectKeys(en as JsonObject).sort();
  const arKeys = collectKeys(ar as JsonObject).sort();

  it("ar.json has no keys missing from en.json", () => {
    const missingInAr = enKeys.filter((k) => !arKeys.includes(k));
    expect(missingInAr, `Keys in en.json but missing from ar.json: ${missingInAr.join(", ")}`).toEqual([]);
  });

  it("en.json has no keys missing from ar.json", () => {
    const missingInEn = arKeys.filter((k) => !enKeys.includes(k));
    expect(missingInEn, `Keys in ar.json but missing from en.json: ${missingInEn.join(", ")}`).toEqual([]);
  });

  it("both catalogs have the same total key count", () => {
    expect(enKeys.length).toBe(arKeys.length);
  });
});
