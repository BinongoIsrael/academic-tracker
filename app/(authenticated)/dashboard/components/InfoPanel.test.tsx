import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import InfoPanel from './InfoPanel';

describe('InfoPanel', () => {
  it('renders current semester units correctly', () => {
    render(
      <InfoPanel 
        enrolledUnits={18.5} 
        completedUnits={12.0} 
        currentGWA={1.75} 
        targetGWA={1.5} 
      />
    );
    
    expect(screen.getByText('18.5')).toBeInTheDocument();
    expect(screen.getByText('12.0')).toBeInTheDocument();
    expect(screen.getByText('1.75')).toBeInTheDocument();
  });

  it('renders N/A when currentGWA is 0 or less', () => {
    render(
      <InfoPanel 
        enrolledUnits={0} 
        completedUnits={0} 
        currentGWA={0} 
        targetGWA={1.5} 
      />
    );
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('calculates units progress correctly', () => {
    const { container } = render(
      <InfoPanel 
        enrolledUnits={100} 
        completedUnits={50} 
        currentGWA={1.0} 
        targetGWA={1.5} 
      />
    );
    
    // Check if the progress bar has width 50%
    const progressBar = container.querySelector('.bg-primary');
    expect(progressBar).toHaveStyle('width: 50%');
  });
});
