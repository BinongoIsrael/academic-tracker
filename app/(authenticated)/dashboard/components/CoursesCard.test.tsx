import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CoursesCard from './CoursesCard';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('CoursesCard', () => {
  const mockCourses = [
    {
      id: '1',
      course_name: 'Introduction to Programming',
      course_code: 'CS101',
      units: 3,
      grade: 1.25,
      term_id: 'term-1',
      user_id: 'user-1',
      course_color: '#FF0000',
    },
    {
      id: '2',
      course_name: 'Academic Writing',
      course_code: 'ENG101',
      units: 3,
      grade: null, // Ongoing
      term_id: 'term-1',
      user_id: 'user-1',
      course_color: '#00FF00',
    },
  ];

  it('renders "No courses found" when the list is empty', () => {
    render(<CoursesCard courses={[]} onAddCourse={() => {}} />);
    expect(screen.getByText(/No courses found/i)).toBeInTheDocument();
  });

  it('renders the correct number of course rows', () => {
    render(<CoursesCard courses={mockCourses} onAddCourse={() => {}} />);
    
    // Header row + 2 course rows
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3);
  });

  it('displays correct status for completed and ongoing courses', () => {
    render(<CoursesCard courses={mockCourses} onAddCourse={() => {}} />);
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('displays the correct grade or placeholder', () => {
    render(<CoursesCard courses={mockCourses} onAddCourse={() => {}} />);
    
    expect(screen.getByText('1.25')).toBeInTheDocument();
    expect(screen.getByText('---')).toBeInTheDocument();
  });
});
