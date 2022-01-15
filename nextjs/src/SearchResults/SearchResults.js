import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import ResultCard from './ResultCard';
import { JOBS_PER_PAGE, useSearchZipRecruiter } from './queries';

const ResultMessage = ({ message }) => {
  return (
    <div>
      <Divider />

      <Typography variant="h5" sx={{ marginTop: 3, textAlign: 'center' }}>
        {message}
      </Typography>
    </div>
  );
};

ResultMessage.propTypes = { message: PropTypes.string };

const SearchResults = ({ search, location, postedTime, radiusMiles }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const {
    isLoading,
    isError,
    data: searchResults,
  } = useSearchZipRecruiter({
    search,
    location,
    page: pageNumber,
    days_ago: postedTime === 0 ? null : postedTime,
    radius_miles: radiusMiles,
  });

  if (isLoading) {
    return <ResultMessage message="Loading..." />;
  }

  if (isError || !searchResults?.success) {
    return (
      <ResultMessage message="Sorry, something went wrong. Please try again later." />
    );
  }

  const { num_paginable_jobs, total_jobs } = searchResults;
  const nJobs = num_paginable_jobs || total_jobs;
  const resultsPage = Math.ceil(nJobs / JOBS_PER_PAGE);

  if (searchResults.total_jobs === 0) {
    return <ResultMessage message="No results found." />;
  }

  return (
    <div>
      <Divider sx={{ marginBottom: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
          {num_paginable_jobs} Results
        </Typography>

        <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
          Page #{pageNumber}
        </Typography>
      </Box>

      {searchResults.jobs.map((job) => (
        <ResultCard
          key={job.id}
          title={job.name}
          companyName={job?.hiring_company?.name}
          companyUrl={job?.hiring_company?.url}
          snippet={job.snippet}
          postedDate={job.posted_time_friendly}
          url={job.url}
          source={job.source}
        />
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 3 }}>
        <Pagination
          data-testid="pagination"
          count={resultsPage}
          page={pageNumber}
          onChange={(_, page) => setPageNumber(page)}
          color="primary"
        />
      </Box>
    </div>
  );
};

SearchResults.propTypes = {
  search: PropTypes.string,
  location: PropTypes.string,
  postedTime: PropTypes.string,
  radiusMiles: PropTypes.string,
};

export default SearchResults;
