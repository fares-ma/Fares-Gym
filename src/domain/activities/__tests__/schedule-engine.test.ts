import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  timeToMinutes,
  computeBlockStatus,
  enrichScheduleBlocks,
} from "../schedule-engine";
import { ScheduleBlock } from "../types";

describe("Schedule Engine Domain Logic", () => {
  it("should convert time string to minutes accurately", () => {
    assert.equal(timeToMinutes("00:00"), 0);
    assert.equal(timeToMinutes("01:30"), 90);
    assert.equal(timeToMinutes("17:00"), 1020);
    assert.equal(timeToMinutes("23:59"), 1439);
    assert.equal(timeToMinutes(""), 0);
  });

  it("should throw RangeError on malformed or out-of-range times", () => {
    assert.throws(() => timeToMinutes("24:00"), RangeError);
    assert.throws(() => timeToMinutes("12:60"), RangeError);
    assert.throws(() => timeToMinutes("invalid"), RangeError);
    assert.throws(() => timeToMinutes("1:30"), RangeError); // must be 2 digits
  });

  it("should compute upcoming block correctly", () => {
    // Current is 12:00 (720 min), block is 14:00 - 16:00 (840 - 960 min)
    const res = computeBlockStatus(840, 960, 720);
    assert.equal(res.status, "upcoming");
    assert.equal(res.remainingMinutes, undefined);
  });

  it("should compute active current block and remaining minutes", () => {
    // Current is 15:15 (915 min), block is 15:00 - 16:00 (900 - 960 min)
    const res = computeBlockStatus(900, 960, 915);
    assert.equal(res.status, "current");
    assert.equal(res.remainingMinutes, 45);
  });

  it("should compute completed block correctly", () => {
    // Current is 18:00 (1080 min), block is 14:00 - 16:00 (840 - 960 min)
    const res = computeBlockStatus(840, 960, 1080);
    assert.equal(res.status, "completed");
  });

  it("should handle overnight blocks accurately across both days", () => {
    // 22:00 (1320 min) -> 02:00 (120 min)
    const startM = 1320;
    const endM = 120;

    // Today at 21:00 (1260 min) -> must be UPCOMING
    const beforeStart = computeBlockStatus(startM, endM, 1260, false);
    assert.equal(beforeStart.status, "upcoming");

    // Today at 23:00 (1380 min) -> must be CURRENT, remaining = 60 + 120 = 180 min
    const activeToday = computeBlockStatus(startM, endM, 1380, false);
    assert.equal(activeToday.status, "current");
    assert.equal(activeToday.remainingMinutes, 180);

    // Preceding day block evaluated today at 01:00 (60 min) -> must be CURRENT, remaining = 60 min
    const activeTomorrowMorning = computeBlockStatus(startM, endM, 60, true);
    assert.equal(activeTomorrowMorning.status, "current");
    assert.equal(activeTomorrowMorning.remainingMinutes, 60);

    // Preceding day block evaluated today at 03:00 (180 min) -> must be COMPLETED
    const completedTomorrow = computeBlockStatus(startM, endM, 180, true);
    assert.equal(completedTomorrow.status, "completed");

    // Also verify passing BlockDayContext object with occurrenceDate and currentDate
    const activeWithDates = computeBlockStatus(startM, endM, 60, {
      occurrenceDate: "2026-09-16",
      currentDate: "2026-09-17",
    });
    assert.equal(activeWithDates.status, "current");
    assert.equal(activeWithDates.remainingMinutes, 60);

    const upcomingSameDate = computeBlockStatus(startM, endM, 1260, {
      occurrenceDate: "2026-09-17",
      currentDate: "2026-09-17",
    });
    assert.equal(upcomingSameDate.status, "upcoming");
  });

  it("should sort and enrich multiple schedule blocks including overnight occurrences", () => {
    const blocks: ScheduleBlock[] = [
      { id: "b2", title: "مذاكرة", dayOfWeek: 4, startTime: "19:00", endTime: "21:00" },
      { id: "b1", title: "الجيم", dayOfWeek: 4, startTime: "17:00", endTime: "18:30" },
      { id: "b3", title: "غداء", dayOfWeek: 4, startTime: "14:00", endTime: "15:00" },
      { id: "b0", title: "نوم أمس", dayOfWeek: 3, startTime: "23:00", endTime: "07:00", isFromPrecedingDay: true },
    ];

    // Current time: 06:30 morning
    const morningTime = new Date(2026, 8, 17, 6, 30);
    const enriched = enrichScheduleBlocks(blocks, morningTime);

    assert.equal(enriched[0].title, "نوم أمس");
    assert.equal(enriched[0].status, "current");
    assert.equal(enriched[0].remainingMinutes, 30);

    assert.equal(enriched[1].title, "غداء");
    assert.equal(enriched[1].status, "upcoming");
  });
});
