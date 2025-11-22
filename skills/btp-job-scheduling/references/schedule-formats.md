# SAP Job Scheduling Service - Schedule Formats

Complete reference for all supported schedule formats.

**Source**: https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/schedule-formats

---

## Cron Format

The SAP cron expression contains **seven fields** (left to right):

| Position | Field | Values | Notes |
|----------|-------|--------|-------|
| 1 | Year | 4-digit (e.g., 2025) | `*` for any year |
| 2 | Month | 1-12 | `*` for any month |
| 3 | Day | -31 to 31 | Negative values count from month end |
| 4 | DayOfWeek | mon, tue, wed, thu, fri, sat, sun | 3-letter abbreviation |
| 5 | Hour | 0-23 | 24-hour format |
| 6 | Minute | 0-59 | |
| 7 | Second | 0-59 | |

### Cron Expression Syntax

| Expression | Position | Meaning |
|------------|----------|---------|
| `*` | anywhere | Any value |
| `*/a` | anywhere | Every a-th value |
| `a:b` | anywhere | Range from a to b |
| `a:b/c` | anywhere | Every c-th value between a and b |
| `a.y` | day of week | a-th occurrence of weekday y (a = -5 to 5) |
| `a,b,c` | anywhere | a or b or c |

### Cron Examples

**Every 30 minutes:**
```
* * * * * */30 0
```

**Every Friday at 12:00:**
```
2025 * * fri 12 0 0
```

**Between 12:00-14:00 hourly, 3rd to second-to-last day of month:**
```
* * 3:-2 * 12:14 0 0
```

**Last Sunday of every month at 09:00:**
```
* * * -1.sun 9 0 0
```

**Every 3 months on 10th at 09:00:**
```
* */3 10 * 9 0 0
```
Or equivalently:
```
* 3,6,9,12 10 * 9 0 0
```

**Every weekday at 08:00:**
```
* * * mon:fri 8 0 0
```

**First Monday of each month at 06:00:**
```
* * * 1.mon 6 0 0
```

**Last day of each month at 23:59:**
```
* * -1 * 23 59 0
```

---

## Date and Time Object Format

Accepts a JSON object with `date` (required) and `format` (optional) fields.

### Supported Parsing Tokens

| Token | Example | Description |
|-------|---------|-------------|
| YYYY | 2025 | 4-digit year |
| YY | 25 | 2-digit year |
| Q | 1-4 | Quarter (sets month to quarter's first month) |
| M MM | 1-12 | Month number |
| MMM MMMM | January-Dec | Month name in locale |
| D DD | 1-31 | Day of month |
| Do | 1st-31st | Day with ordinal |
| DDD DDDD | 1-365 | Day of year |
| X | 1410715640.579 | UNIX timestamp (seconds) |
| x | 1410715640579 | UNIX timestamp (milliseconds) |
| gggg | 2025 | Locale 4-digit week year |
| gg | 25 | Locale 2-digit week year |
| w ww | 1-53 | Locale week of year |
| e | 1-7 | Locale day of week |
| GGGG | 2025 | ISO 4-digit week year |
| GG | 25 | ISO 2-digit week year |
| W WW | 1-53 | ISO week of year |
| E | 1-7 | ISO day of week |
| H HH | 0-23 | 24-hour time |
| h hh | 1-12 | 12-hour time (with a/A) |
| a A | am pm | Before/after noon |
| m mm | 0-59 | Minutes |
| s ss | 0-59 | Seconds |
| S | 0-9 | Tenths of second |
| SS | 0-99 | Hundredths of second |
| SSS | 0-999 | Thousandths of second |
| Z ZZ | +12:00 | UTC offset (±HH:mm, ±HHmm, or Z) |

### Date Object Examples

**With format string:**
```json
{
  "startTime": {
    "date": "2025-10-20 04:30 +0000",
    "format": "YYYY-MM-DD HH:mm Z"
  }
}
```

**ISO week date:**
```json
{
  "endTime": {
    "date": "2025-W06-5"
  }
}
```

**With milliseconds:**
```json
{
  "time": {
    "date": "2025-12-08 09:30:26.123"
  }
}
```

---

## Date String Format (ISO-8601 / RFC 2822)

Must conform to ISO-8601 or IETF RFC 2822 standards.

### ISO-8601 Examples

**Calendar date with time and timezone:**
```json
{ "time": "1994-11-05T08:15:30-05:00" }
```

**Calendar date only:**
```json
{ "time": "2025-02-08" }
```

**Week date:**
```json
{ "time": "2025-W06-5" }
```

**Ordinal date:**
```json
{ "time": "2025-039" }
```

**Date with time and offset:**
```json
{ "time": "2025-02-08 09+07:00" }
```

---

## Human-Readable Date Formats

The service includes an embedded English-language date parser.

### Time Parameter (One-time execution)

| Example | Description |
|---------|-------------|
| `"now"` | Execute immediately |
| `"10 hours from now"` | 10 hours from current time |
| `"20 minutes from now"` | 20 minutes from current time |
| `"in 2 hours"` | 2 hours from current time |
| `"tomorrow at 4pm"` | Tomorrow at 16:00 |
| `"next week monday at 5am"` | Next Monday at 05:00 |
| `"9pm tonight"` | Today at 21:00 |
| `"3.30pm"` | Today at 15:30 |

### RepeatAt Parameter (Daily recurring)

Creates schedules that run daily at a specific time.

| Example | Description |
|---------|-------------|
| `"4.40pm"` | Daily at 16:40 |
| `"18.40"` | Daily at 18:40 |
| `"6.20am"` | Daily at 06:20 |
| `"17.20:30"` | Daily at 17:20:30 (second precision may be inaccurate) |

### RepeatInterval Parameter (Recurring intervals)

| Example | Description |
|---------|-------------|
| `"10 hours"` | Every 10 hours |
| `"2 days"` | Every 2 days |
| `"5 minutes"` | Every 5 minutes |
| `"1 week"` | Every week |
| `"3 months"` | Every 3 months |

**Supported units**: years, months, weeks, days, hours, minutes, seconds

---

## Important Notes

### Time Zone
**UTC only** - The service operates exclusively in UTC. No other time zones are supported.

### Minimum Interval
The minimum schedule interval is **5 minutes**. Schedules with shorter intervals will be rejected.

### Month/Year Assumptions
The service assumes:
- All months have 30 days
- All years have 365 days

For month-specific scheduling, use cron format instead of repeatInterval.

### Invalid Input Behavior
- Invalid string inputs for time parameters may yield unpredictable results
- For repeatAt, invalid strings default to immediate execution at current timestamp

---

## Schedule Type Selection Guide

| Use Case | Recommended Format |
|----------|-------------------|
| Specific time, one-time | `time` with ISO-8601 or human-readable |
| Daily at exact time | `repeatAt` |
| Fixed interval from last run | `repeatInterval` |
| Complex patterns (last Sunday, etc.) | `cron` |
| Monthly on specific date | `cron` |
| Quarterly schedules | `cron` |

---

**Documentation Source**: https://github.com/SAP-docs/btp-job-scheduling-service/blob/main/docs/20---Concepts/schedule-formats-54615f0.md
