import { render, screen } from '@testing-library/react';
import ResultCard from './ResultCard';

describe('Search Form', () => {
  it('displays all card info', () => {
    render(
      <ResultCard
        source="LinkedIn.com"
        snippet="This is a result snippet"
        title="Senior Fun Times Engineer"
        companyName="JobGet"
        postedDate="1 week ago"
        url="www.jobget.com"
      />
    );

    expect(screen.getByText('LinkedIn.com')).toBeInTheDocument();
    expect(screen.getByText('This is a result snippet')).toBeInTheDocument();
    expect(screen.getByText('Senior Fun Times Engineer')).toBeInTheDocument();
    expect(screen.getByText('JobGet')).toBeInTheDocument();
    expect(screen.getByText('1 week ago')).toBeInTheDocument();
  });

  it('links to job url', () => {
    render(
      <ResultCard
        source="LinkedIn.com"
        snippet="This is a result snippet"
        title="Senior Fun Times Engineer"
        companyName="JobGet"
        postedDate="1 week ago"
        url="www.jobget.com"
      />
    );

    const button = screen.getByText('Learn More');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', 'www.jobget.com');
  });
});
