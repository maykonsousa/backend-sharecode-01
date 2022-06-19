import { dateTypes, IDateProvider } from '../IDateProvider';
import { DateTime } from 'luxon';
export class LuxonDateProvider implements IDateProvider {
  addDays({ date, value }: dateTypes): Date {
    return DateTime.fromJSDate(date as Date)
      .plus({ days: value })
      .toJSDate();
  }

  addHours({ date, value }: dateTypes): Date {
    return DateTime.fromJSDate(date as Date)
      .plus({ hours: value })
      .toJSDate();
  }

  dateNow(): Date {
    return DateTime.now().toJSDate();
  }

  formatDate({ date, format }: dateTypes): string {
    return DateTime.fromJSDate(date as Date).toFormat(format as string);
  }

  compare({ startDate, endDate, unit = 'days' }: dateTypes): number {
    const start = DateTime.fromJSDate(startDate as Date);
    const end = DateTime.fromJSDate(endDate as Date);
    const diference = start.diff(end, unit)[unit];
    return diference;
  }
}
