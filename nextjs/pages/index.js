import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SearchForm from '../src/SearchForm';
import SearchResults from '../src/SearchResults';
import Typography from '@mui/material/Typography';

export default function Index() {
  const [pathQueries, setPathQueries] = useState(-1);
  const [submitValues, setSubmitValues] = useState();
  const router = useRouter();

  const onSearch = (searchValues) => {
    setSubmitValues(searchValues);

    const { location, jobTitle, radiusMiles, postedTime } = searchValues;
    router.push({
      query: {
        search: jobTitle,
        location,
        radius: radiusMiles,
        daysAgo: postedTime,
      },
    });
  };

  useEffect(() => {
    if (router.isReady) {
      setPathQueries(router.query);
    }
  }, [router.isReady]);

  if (pathQueries === -1) {
    return '';
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          color="text.secondary"
          sx={{ textAlign: 'center', marginBottom: 5 }}
        >
          <small>Let&apos;s find your</small>
          <br /> <strong>dream job</strong>
        </Typography>

        <SearchForm
          onSearch={onSearch}
          search={pathQueries.search}
          location={pathQueries.location}
          daysAgo={pathQueries.daysAgo}
          radius={pathQueries.radius}
        />

        {submitValues && (
          <SearchResults
            search={submitValues.jobTitle}
            location={submitValues.searchLocation}
            postedTime={submitValues.postedTime}
            radiusMiles={submitValues.radiusMiles}
          />
        )}
      </Box>
    </Container>
  );
}
