import { describe, it, expect } from 'vitest';
import { calculateGWA, formatUnits, getSemesterShortName, mapTermData } from './calculations';

describe('calculateGWA', () => {
  it('calculates correct GWA for multiple courses', () => {
    const courses = [
      { grade: 1.0, units: 3 },
      { grade: 2.0, units: 3 }
    ];
    expect(calculateGWA(courses)).toBe("1.50");
  });

  it('handles zero or null grades correctly', () => {
    const courses = [
      { grade: 1.0, units: 3 },
      { grade: null, units: 3 },
      { grade: 0, units: 2 }
    ];
    expect(calculateGWA(courses)).toBe("1.00");
  });

  it('returns 0.00 when no courses are provided', () => {
    expect(calculateGWA([])).toBe("0.00");
  });

  it('handles different unit counts', () => {
    const courses = [
      { grade: 1.25, units: 5 },
      { grade: 1.75, units: 3 }
    ];
    // (1.25 * 5 + 1.75 * 3) / 8 = (6.25 + 5.25) / 8 = 11.5 / 8 = 1.4375
    expect(calculateGWA(courses)).toBe("1.44");
  });
});

describe('formatUnits', () => {
  it('formats integer units with one decimal place', () => {
    expect(formatUnits(3)).toBe("3.0");
  });

  it('formats float units correctly', () => {
    expect(formatUnits(3.5)).toBe("3.5");
  });
});

describe('getSemesterShortName', () => {
  it('shortens 1st Semester', () => {
    expect(getSemesterShortName("1st Semester")).toBe("S1");
  });

  it('shortens 2nd Semester', () => {
    expect(getSemesterShortName("2nd Semester")).toBe("S2");
  });

  it('shortens Short Term', () => {
    expect(getSemesterShortName("Short Term")).toBe("ST");
  });

  it('returns original if no match', () => {
    expect(getSemesterShortName("Summer")).toBe("Summer");
  });
});

describe('mapTermData', () => {
  it('correctly maps raw term data with courses', () => {
    const rawData = {
      id: 'term-1',
      user_id: 'user-1',
      academic_year: '2023-2024',
      semester: '1st Semester',
      start_date: '2023-08-01',
      end_date: '2023-12-01',
      is_active: true,
      courses: [
        { id: 'c1', units: 3, grade: 1.25 },
        { id: 'c2', units: 3, grade: null },
        { id: 'c3', units: 2, grade: 1.75 }
      ],
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };

    const result = mapTermData(rawData);

    expect(result.id).toBe('term-1');
    expect(result.courses).toBe(3);
    expect(result.units).toBe(8);
    // GPA: (1.25 + 1.75) / 2 = 1.50
    expect(result.gpa).toBe(1.50);
  });

  it('handles terms with no courses', () => {
    const rawData = {
      id: 'term-empty',
      courses: []
    };
    const result = mapTermData(rawData);
    expect(result.courses).toBe(0);
    expect(result.units).toBe(0);
    expect(result.gpa).toBeNull();
  });
});
