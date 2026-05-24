import { describe, it, expect } from 'vitest';
import { convertPercentageToGPA, getGradeRemark } from './convertPercentageToGPA';
import { GradingScale } from '@/types';

describe('convertPercentageToGPA', () => {
  const mockScale: GradingScale[] = [
    { grade_point: 1.0, min_percentage: 97, max_percentage: 100 } as any,
    { grade_point: 1.25, min_percentage: 94, max_percentage: 96.99 } as any,
    { grade_point: 3.0, min_percentage: 75, max_percentage: 75.99 } as any,
    { grade_point: 5.0, min_percentage: 0, max_percentage: 74.99 } as any,
  ];

  it('converts high percentage to top grade', () => {
    expect(convertPercentageToGPA(98, mockScale)).toBe(1.0);
  });

  it('converts borderline percentage correctly', () => {
    expect(convertPercentageToGPA(75, mockScale)).toBe(3.0);
  });

  it('returns 5.0 for failing percentage', () => {
    expect(convertPercentageToGPA(60, mockScale)).toBe(5.0);
  });

  it('handles unsorted scales correctly', () => {
    const unsortedScale = [...mockScale].reverse();
    expect(convertPercentageToGPA(98, unsortedScale)).toBe(1.0);
  });
});

describe('getGradeRemark', () => {
  it('returns correct remarks for various GPAs', () => {
    expect(getGradeRemark(1.0)).toBe("Excellent");
    expect(getGradeRemark(1.5)).toBe("Very Good");
    expect(getGradeRemark(2.0)).toBe("Good");
    expect(getGradeRemark(2.5)).toBe("Satisfactory");
    expect(getGradeRemark(3.0)).toBe("Passed");
    expect(getGradeRemark(5.0)).toBe("Failed");
  });
});
