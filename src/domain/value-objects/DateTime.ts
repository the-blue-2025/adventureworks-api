export class DateTime {
  private readonly value: Date;

  private constructor(date: Date) {
    this.value = date;
  }

  public static create(date: Date | string): DateTime {
    if (date instanceof Date) {
      return new DateTime(date);
    }

    // Try parsing different date formats
    const parsedDate = this.parseDateString(date);
    if (!parsedDate) {
      throw new Error(`Invalid date format: ${date}`);
    }

    return new DateTime(parsedDate);
  }

  private static parseDateString(dateStr: string): Date | null {
    // Try ISO format first
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    // Try common formats
    const formats = [
      // YYYY-MM-DD
      /^(\d{4})-(\d{2})-(\d{2})$/,
      // YYYY/MM/DD
      /^(\d{4})\/(\d{2})\/(\d{2})$/,
      // DD-MM-YYYY
      /^(\d{2})-(\d{2})-(\d{4})$/,
      // DD/MM/YYYY
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
      // YYYY-MM-DD HH:mm:ss
      /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
      // YYYY/MM/DD HH:mm:ss
      /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [_, ...parts] = match;
        if (parts.length === 3) {
          // Date only
          const [year, month, day] = parts;
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (parts.length === 6) {
          // Date and time
          const [year, month, day, hour, minute, second] = parts;
          return new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second)
          );
        }
      }
    }

    return null;
  }

  public toDate(): Date {
    return new Date(this.value);
  }

  public toISOString(): string {
    return this.value.toISOString();
  }

  public toDateOnly(): string {
    return this.value.toISOString().split('T')[0];
  }

  public equals(other: DateTime): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  public isBefore(other: DateTime): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  public isAfter(other: DateTime): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  public addDays(days: number): DateTime {
    const newDate = new Date(this.value);
    newDate.setDate(newDate.getDate() + days);
    return new DateTime(newDate);
  }

  public addMonths(months: number): DateTime {
    const newDate = new Date(this.value);
    newDate.setMonth(newDate.getMonth() + months);
    return new DateTime(newDate);
  }

  public addYears(years: number): DateTime {
    const newDate = new Date(this.value);
    newDate.setFullYear(newDate.getFullYear() + years);
    return new DateTime(newDate);
  }

  public static now(): DateTime {
    return new DateTime(new Date());
  }
} 