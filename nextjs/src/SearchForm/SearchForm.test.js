import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SearchForm from './SearchForm';
import { setupGoogleMock } from '../../tests/utils/setupGoogleMock';

beforeAll(() => setupGoogleMock());

describe('Search Form', () => {
  it('loads default form values', () => {
    render(<SearchForm onSearch={() => {}} />);

    expect(screen.getByTestId('search-form')).toHaveFormValues({
      jobTitle: '',
      locationSearchText: '',
      radiusMiles: '20',
      postedTime: '0',
    });
  });

  it('loads prop form values', () => {
    render(
      <SearchForm
        search="Java"
        radius="15"
        daysAgo="7"
        location="Santa Monica, CA, USA"
        onSearch={() => {}}
      />
    );

    expect(screen.getByTestId('search-form')).toHaveFormValues({
      jobTitle: 'Java',
      locationSearchText: 'Santa Monica, CA, USA',
      radiusMiles: '15',
      postedTime: '7',
    });
  });

  it('calls onSearch callback when form is supplied with valid defaults', () => {
    const handleSearch = jest.fn();
    render(
      <SearchForm
        search="Java"
        radius="15"
        daysAgo="7"
        location="Santa Monica, CA, USA"
        onSearch={handleSearch}
      />
    );

    expect(handleSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        jobTitle: 'Java',
        location: 'Santa Monica, CA, USA',
        postedTime: '7',
        radiusMiles: '15',
        searchLocation: 'Santa Monica, CA',
      })
    );
  });

  it('does not call onSearch callback when form is supplied with invalid defaults: missing search', () => {
    const handleSearch = jest.fn();
    render(
      <SearchForm
        radius="15"
        daysAgo="7"
        location="Santa Monica, CA, USA"
        onSearch={handleSearch}
      />
    );

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('does not call onSearch callback when form is supplied with invalid defaults: missing location', async () => {
    const handleSearch = jest.fn();
    render(
      <SearchForm
        search="Python"
        radius="15"
        daysAgo="7"
        location=""
        onSearch={handleSearch}
      />
    );

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('search Jobs buttons only calls onSearch callback when form is valid', async () => {
    const handleSearch = jest.fn();
    render(
      <SearchForm
        search=""
        radius="15"
        daysAgo="7"
        location="Santa Monica, CA, USA"
        onSearch={handleSearch}
      />
    );

    expect(handleSearch).not.toHaveBeenCalled();
    const searchButton = await screen.findByText('Search Jobs');
    fireEvent.click(searchButton);
    await waitFor(() => expect(handleSearch).not.toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText('Job title or keyword'), {
      target: { value: 'Haskell' },
    });

    fireEvent.click(searchButton);
    await waitFor(() =>
      expect(handleSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          jobTitle: 'Haskell',
          location: 'Santa Monica, CA, USA',
          postedTime: '7',
          radiusMiles: '15',
          searchLocation: 'Santa Monica, CA',
        })
      )
    );
  });

  it('invalid search shows form error messages', async () => {
    const handleSearch = jest.fn();
    render(
      <SearchForm
        search=""
        radius="15"
        daysAgo="7"
        location=""
        onSearch={handleSearch}
      />
    );

    expect(handleSearch).not.toHaveBeenCalled();

    const searchButton = await screen.findByText('Search Jobs');
    fireEvent.click(searchButton);

    expect(
      await screen.findByText('Complete the form to find your dream job!')
    ).toBeInTheDocument();
  });
});
