import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import PlacesAutocomplete from 'react-places-autocomplete';

import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from '@mui/material';
// import { AccountCircle } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';

// const predictCityGoogle = async (input) => {
//   console.log('INPUT', input);
//   const response = await axios.get(
//     'https://maps.googleapis.com/maps/api/place/autocomplete/json',
//     {
//       params: {
//         input,
//         key: 'AIzaSyAmyCX4E5aVFn89zOk7VAejJrwYNIIE9H8',
//         types: 'geocode',
//         components: 'country:us|country:gb',
//         cities: true,
//       },
//     }
//   );
//
//   return response.data;
// };
//
// const usePredictCityGoogle = ({ input, enabled }) => {
//   console.log('ENABLED?', input && enabled);
//   return useQuery(['googleCityPredict'], () => predictCityGoogle(input), {
//     enabled: !!(input && enabled),
//   });
// };

const JOBS_PER_PAGE = 10;

const searchZipRecruiter = async (params = {}) => {
  const response = await axios.get('https://api.ziprecruiter.com/jobs/v1', {
    params: {
      api_key: 'mthpyw9ea7zyswfuj3zur6bt55fce7qf',
      page: 1,
      jobs_per_page: JOBS_PER_PAGE,
      ...params,
    },
  });

  return response.data;
};

const useSearchZipRecruiter = (params) => {
  return useQuery(
    [
      'zipSearch',
      params.search,
      params.location,
      params.page,
      params.radius_miles,
      params.days_ago,
    ],
    () => searchZipRecruiter(params),
    {
      // keepPreviousData: true,
    }
  );
};

const Result = ({
  title,
  companyName,
  companyUrl,
  salary,
  snippet,
  postedDate,
  url,
  source,
}) => {
  return (
    <Box sx={{ minWidth: 275, paddingY: 1 }}>
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <div>
              <Typography variant="h5" component="div">
                {title}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {companyName}
              </Typography>
            </div>

            <div>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {salary}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {postedDate}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {source}
              </Typography>
            </div>
          </Box>

          <Typography variant="body2">
            <span dangerouslySetInnerHTML={{ __html: snippet }} />
          </Typography>
        </CardContent>

        <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" href={url}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

const SearchResults = ({ search, location, postedTime, radiusMiles }) => {
  const [page, setPage] = useState(1);
  const {
    isLoading,
    isError,
    data: searchResults,
    error,
  } = useSearchZipRecruiter({
    search,
    location,
    page,
    days_ago: postedTime === 0 ? null : postedTime,
    radius_miles: radiusMiles,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !searchResults?.success) {
    console.error(error);
    return <div>Job Search Error</div>;
  }

  const { num_paginable_jobs, total_jobs } = searchResults;
  const nJobs = num_paginable_jobs || total_jobs;
  const resultsPage = Math.ceil(nJobs / JOBS_PER_PAGE);

  if (searchResults.total_jobs === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      <div>{num_paginable_jobs} Results</div>

      {searchResults.jobs.map((job) => {
        let salary;
        if (job.salary_interval) {
          const postfix = (() => {
            switch (job.salary_interval) {
              case 'hourly':
                return 'per hour';
              case 'weekly':
                return 'per week';
              case 'monthly':
                return 'per month';
              default:
                return 'annually';
            }
          })();

          salary = `${job.salary_min} - ${job.salary_max} ${postfix}`;
        }
        return (
          <Result
            key={job.id}
            title={job.name}
            companyName={job?.hiring_company?.name}
            companyUrl={job?.hiring_company?.url}
            snippet={job.snippet}
            postedDate={job.posted_time_friendly}
            url={job.url}
            source={job.source}
            salary={salary}
          />
        );
      })}
      <Pagination
        count={resultsPage}
        page={page}
        onChange={(_, page) => setPage(page)}
        color="primary"
      />
    </div>
  );
};

const radiusMilesOptions = [
  { label: 'Within 5 miles', value: 5 },
  { label: 'Within 10 miles', value: 10 },
  { label: 'Within 15 miles', value: 15 },
  { label: 'Within 20 miles', value: 20 },
  { label: 'Within 50 miles', value: 50 },
];

const postedTimeOptions = [
  { label: 'Posted Anytime', value: 0 },
  { label: 'Last 24 hours', value: 1 },
  { label: 'Last 3 days', value: 3 },
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 14 days', value: 14 },
];

export default function Index() {
  const [val, setVal] = useState('');
  const [pathQueries, setPathQueries] = useState(null);
  const [submitValues, setSubmitValues] = useState();
  const router = useRouter();

  useEffect(() => {
    setPathQueries(router.query);
    console.log('pathQueroes', pathQueries);
  }, [router.isReady]);

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      jobTitle: pathQueries.search,
      location: pathQueries.location,
      locationSearchText: '',
      radiusMiles: pathQueries.radius || radiusMilesOptions[3].value,
      postedTime: pathQueries.daysAgo || postedTimeOptions[0].value,
    },
  });

  // formState.isValid is broken :(
  const isValid = () => {
    const { jobTitle, location } = getValues();
    return !!(jobTitle && location);
  };
  const radiusMiles = watch('radiusMiles');
  const postedTime = watch('postedTime');

  useEffect(() => {
    register('location', { required: true });
  }, [register]);

  useEffect(() => {
    if (isValid()) {
      onSubmit(getValues());
    }
  }, [radiusMiles, postedTime]);

  const clearLocation = (_, value) => {
    if (value) return;
    setLocation(null);
  };

  const onSubmit = (data) => {
    const { location, jobTitle, radiusMiles, postedTime } = data;
    let searchLocation = location.endsWith(', USA')
      ? location.split(', USA')[0]
      : location;

    setSubmitValues({
      ...data,
      searchLocation,
      timestamp: '?',
    });

    router.push({
      query: {
        search: jobTitle,
        location,
        radius: radiusMiles,
        daysAgo: postedTime,
      },
    });
  };

  const setLocation = (_, value) => {
    setValue('location', value);
    if (isValid()) {
      onSubmit(getValues());
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>

        <br />
        <br />
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl variant="standard" fullWidth>
            <Controller
              name="jobTitle"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                  <TextField
                    label="Job title or keyword"
                    fullWidth
                    type="search"
                    variant="standard"
                    error={!!errors.jobTitle}
                    helperText={
                      errors.jobTitle?.type === 'required' ? 'Required' : ''
                    }
                    {...field}
                  />
                </Box>
              )}
            />

            <br />
            <br />

            <PlacesAutocomplete
              value={val}
              onChange={setVal}
              searchOptions={{
                types: ['(cities)'],
                componentRestrictions: { country: ['us', 'gb'] },
                // fields: ["address_components", "geometry", "icon", "name"],
              }}
            >
              {({ getInputProps, suggestions, loading }) => (
                <Controller
                  name="locationSearchText"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      freeSolo={false}
                      onChange={setLocation}
                      onInputChange={clearLocation}
                      options={suggestions.map((option) => option.description)}
                      loadingText="Loading cities..."
                      loading={loading}
                      renderInput={(params) => (
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                          <LocationOnIcon
                            sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                          />

                          <TextField
                            {...params}
                            {...field}
                            {...getInputProps()}
                            label="Search City or State"
                            variant="standard"
                            error={!!errors.location}
                            helperText={
                              errors.location?.type === 'required'
                                ? 'Required'
                                : ''
                            }
                          />
                        </Box>
                      )}
                    />
                  )}
                />
              )}
            </PlacesAutocomplete>

            <br />

            <Controller
              name="radiusMiles"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel>Radius</InputLabel>
                  <Select {...field} label="Radius">
                    {radiusMilesOptions.map((option) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="postedTime"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel>Posted Time</InputLabel>
                  <Select {...field} label="Posted Time">
                    {postedTimeOptions.map((option) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Button type="submit" variant="contained">
              Search Jobs
            </Button>
          </FormControl>
        </form>
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
