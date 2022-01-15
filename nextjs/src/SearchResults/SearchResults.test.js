import { render, screen } from '@testing-library/react';
import SearchResults from './SearchResults';

import * as queries from './queries';
import QueryClientWrapper from '../../tests/utils/QueryClientWrapper';

const createJob = (id) => ({
  id: `id-${id}`,
  name: `Name ${id}`,
  hiring_company: { name: `Company Name ${id}`, url: `www.company-${id}.com` },
  snippet: `Some snippet ${id}`,
  posted_time_friendly: '3 days ago',
  url: 'www.original.com',
  source: 'LinkedIn.com',
  salary_interval: 'yearly',
  salary_min: '200',
  salary_max: '300',
});

const createNJobs = (n) => new Array(n).fill().map((_, i) => createJob(i));

describe('SearchResults', () => {
  it('displays loading message', () => {
    jest
      .spyOn(queries, 'useSearchZipRecruiter')
      .mockImplementation(() => ({ isLoading: true }));

    render(
      <QueryClientWrapper>
        <SearchResults
          search="Search term"
          radiusMiles="20"
          location="London, UK"
          postedTime="7"
        />
      </QueryClientWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error message: search error', () => {
    jest
      .spyOn(queries, 'useSearchZipRecruiter')
      .mockImplementation(() => ({ isLoading: false, isError: 'Some Error' }));

    render(
      <QueryClientWrapper>
        <SearchResults
          search="Search term"
          radiusMiles="20"
          location="London, UK"
          postedTime="7"
        />
      </QueryClientWrapper>
    );

    expect(
      screen.getByText('Sorry, something went wrong. Please try again later.')
    ).toBeInTheDocument();
  });

  it('displays error message: results error', () => {
    jest.spyOn(queries, 'useSearchZipRecruiter').mockImplementation(() => ({
      isLoading: false,
      isError: false,
      data: { success: false },
    }));

    render(
      <QueryClientWrapper>
        <SearchResults
          search="Search term"
          radiusMiles="20"
          location="London, UK"
          postedTime="7"
        />
      </QueryClientWrapper>
    );

    expect(
      screen.getByText('Sorry, something went wrong. Please try again later.')
    ).toBeInTheDocument();
  });

  it('displays no results', () => {
    jest.spyOn(queries, 'useSearchZipRecruiter').mockImplementation(() => ({
      isLoading: false,
      data: { success: true, total_jobs: 0 },
    }));

    render(
      <QueryClientWrapper>
        <SearchResults
          search="Search term"
          radiusMiles="20"
          location="London, UK"
          postedTime="7"
        />
      </QueryClientWrapper>
    );

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('displays no results', () => {
    const jobs = createNJobs(4);

    jest.spyOn(queries, 'useSearchZipRecruiter').mockImplementation(() => ({
      isLoading: false,
      data: { success: true, total_jobs: jobs.length, jobs },
    }));

    render(
      <QueryClientWrapper>
        <SearchResults
          search="Search term"
          radiusMiles="20"
          location="London, UK"
          postedTime="7"
        />
      </QueryClientWrapper>
    );

    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Name 0')).toBeInTheDocument();
    expect(screen.getByText('Company Name 1')).toBeInTheDocument();
    expect(screen.getByText('Some snippet 2')).toBeInTheDocument();
    expect(screen.getAllByText('Learn More')).toHaveLength(4);
  });

  it('displays pagination when more than 15 results are returned', () => {
    const jobs = createNJobs(15 * 5);

    jest.spyOn(queries, 'useSearchZipRecruiter').mockImplementation(() => ({
      isLoading: false,
      data: { success: true, total_jobs: jobs.length, jobs },
    }));

    render(
      <QueryClientWrapper>
        <SearchResults
          search="Search term"
          radiusMiles="20"
          location="London, UK"
          postedTime="7"
        />
      </QueryClientWrapper>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
