import { dateTypes, IDateProvider } from '../IDateProvider';
import { DateTime } from 'luxon';
export class LuxonDateProvider implements IDateProvider {
  add({ date, value }: dateTypes): Date {
    return DateTime.fromJSDate(date as Date)
      .plus({ days: value })
      .toJSDate();
  }

  dateNow(): Date {
    return DateTime.now().toJSDate();
  }

  formatDate({ date, format }: dateTypes): string {
    return DateTime.fromJSDate(date as Date).toFormat(format as string);
  }

  compare({ startDate, endDate, unit }: dateTypes): number {
    const start = DateTime.fromISO(`${startDate}`);
    const end = DateTime.fromISO(`${endDate}`);
    return start.diff(end, unit as any).valueOf();
  }
}
