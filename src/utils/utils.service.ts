import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  dateRangesOverlap(i1: [string, string], i2: [string, string]) {
    const range1Start = new Date(i1[0]);
    const range1End = new Date(i1[1]);

    const range2Start = new Date(i2[0]);
    const range2End = new Date(i2[1]);

    const maxStart = new Date(
      Math.max(range1Start.getTime(), range2Start.getTime()),
    );

    const minEnd = new Date(Math.min(range1End.getTime(), range2End.getTime()));

    return maxStart <= minEnd;
  }
}
