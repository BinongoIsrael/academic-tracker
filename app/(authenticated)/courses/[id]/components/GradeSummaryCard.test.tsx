import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GradeSummaryCard from './GradeSummaryCard';

describe('GradeSummaryCard', () => {
  const defaultProps = {
    targetGPA: 1.50,
    currentGPA: 1.75,
    currentPercentage: 85.5,
    finalGPA: null,
    finalPercentage: null,
    hasGradingScale: true,
    requiredScoreToTarget: 92.0,
    targetStatus: "possible" as const,
  };

  it('renders target GPA and required average when possible', () => {
    render(<GradeSummaryCard {...defaultProps} />);
    
    expect(screen.getByText('1.50')).toBeInTheDocument();
    expect(screen.getByText('92.0%')).toBeInTheDocument();
    expect(screen.getByText(/Needed on remaining tasks/i)).toBeInTheDocument();
  });

  it('renders "Target Secured" when reached', () => {
    render(<GradeSummaryCard {...defaultProps} targetStatus="reached" />);
    
    expect(screen.getByText('Target Secured')).toBeInTheDocument();
  });

  it('renders "Mathematically Unreachable" when impossible', () => {
    render(<GradeSummaryCard {...defaultProps} targetStatus="impossible" requiredScoreToTarget={105.0} />);
    
    expect(screen.getByText('Mathematically Unreachable')).toBeInTheDocument();
    expect(screen.getByText(/Requires 105.0% average/i)).toBeInTheDocument();
  });

  it('renders "Grading scale required" message', () => {
    render(<GradeSummaryCard {...defaultProps} targetStatus="missing_scale" hasGradingScale={false} />);
    
    expect(screen.getByText(/Grading scale required for prediction/i)).toBeInTheDocument();
  });

  it('renders N/A for current GPA when null', () => {
    render(<GradeSummaryCard {...defaultProps} currentGPA={null} currentPercentage={null} />);
    
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
