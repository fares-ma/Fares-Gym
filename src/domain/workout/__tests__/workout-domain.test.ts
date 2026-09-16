import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseWeight, formatWeight } from "../weight-parser";
import { getNextProgramId } from "../rotation-engine";
import { calculateWarmupSets, getHeatingSetCount } from "../warmup-engine";

describe("Weight Parser Domain Logic", () => {
  it("should preserve opaque machine tag 'K' without converting to kg", () => {
    const res = parseWeight("50K");
    assert.equal(res.rawWeight, "50K");
    assert.equal(res.numericValue, 50);
    assert.equal(res.unitTag, "K");
    assert.equal(res.isUnitConfirmed, true);
  });

  it("should normalize lowercase 'k' to uppercase 'K'", () => {
    const res = parseWeight("65k");
    assert.equal(res.rawWeight, "65K");
    assert.equal(res.numericValue, 65);
    assert.equal(res.unitTag, "K");
    assert.equal(res.isUnitConfirmed, true);
  });

  it("should preserve opaque tag 'B'", () => {
    const res = parseWeight("10B");
    assert.equal(res.rawWeight, "10B");
    assert.equal(res.numericValue, 10);
    assert.equal(res.unitTag, "B");
    assert.equal(res.isUnitConfirmed, true);
  });

  it("should handle plain numbers with unconfirmed unit tag", () => {
    const res = parseWeight("25");
    assert.equal(res.numericValue, 25);
    assert.equal(res.unitTag, "");
    assert.equal(res.isUnitConfirmed, false);
  });

  it("should format weight correctly", () => {
    assert.equal(formatWeight({ rawWeight: "50K", numericValue: 50, unitTag: "K", isUnitConfirmed: true }), "50K");
    assert.equal(formatWeight(null), "-");
  });
});

describe("Program Rotation Engine", () => {
  const programs = [
    { id: "anterior_a", orderIndex: 1 },
    { id: "posterior_a", orderIndex: 2 },
    { id: "anterior_b", orderIndex: 3 },
    { id: "posterior_b", orderIndex: 4 },
  ];

  it("should default to the first program if no prior session exists", () => {
    const next = getNextProgramId(programs, null);
    assert.equal(next, "anterior_a");
  });

  it("should advance from Anterior A to Posterior A", () => {
    const next = getNextProgramId(programs, "anterior_a");
    assert.equal(next, "posterior_a");
  });

  it("should advance from Posterior A to Anterior B", () => {
    const next = getNextProgramId(programs, "posterior_a");
    assert.equal(next, "anterior_b");
  });

  it("should advance from Anterior B to Posterior B", () => {
    const next = getNextProgramId(programs, "anterior_b");
    assert.equal(next, "posterior_b");
  });

  it("should wrap around from Posterior B back to Anterior A", () => {
    const next = getNextProgramId(programs, "posterior_b");
    assert.equal(next, "anterior_a");
  });
});

describe("Warm-up & Heating Engine", () => {
  it("should return 0 sets if heating rule is '0'", () => {
    assert.equal(getHeatingSetCount("0"), 0);
    const sets = calculateWarmupSets(parseWeight("57.5k"), "0");
    assert.equal(sets.length, 0);
  });

  it("should calculate 2 heating sets for rule '1-2'", () => {
    assert.equal(getHeatingSetCount("1-2"), 2);
    const weight = parseWeight("50K");
    const sets = calculateWarmupSets(weight, "1-2");
    assert.equal(sets.length, 2);
    assert.equal(sets[0].weight.unitTag, "K");
    assert.equal(sets[0].weight.numericValue, 25); // 50 * 0.5
    assert.equal(sets[1].weight.numericValue, 37.5); // 50 * 0.75
  });

  it("should preserve opaque tags in warmup sets", () => {
    const weight = parseWeight("200k");
    const sets = calculateWarmupSets(weight, "1-3");
    assert.equal(sets.length, 3);
    assert.equal(sets[0].weight.unitTag, "K");
    assert.equal(sets[0].weight.rawWeight, "100K");
  });
});
