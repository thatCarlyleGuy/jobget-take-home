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
  Chip,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';

const predictCityGoogle = async (input) => {
  console.log('INPUT', input);
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    {
      params: {
        input,
        key: 'AIzaSyAmyCX4E5aVFn89zOk7VAejJrwYNIIE9H8',
        types: 'geocode',
        components: 'country:us|country:gb',
        cities: true,
      },
    }
  );

  return response.data;
};

const usePredictCityGoogle = ({ input, enabled }) => {
  console.log('ENABLED?', input && enabled);
  return useQuery(['googleCityPredict'], () => predictCityGoogle(input), {
    enabled: !!(input && enabled),
  });
};

const searchZipRecruiter = async (params = {}) => {
  const response = await axios.get('https://api.ziprecruiter.com/jobs/v1', {
    params: {
      api_key: 'mthpyw9ea7zyswfuj3zur6bt55fce7qf',
      page: 1,
      jobs_per_page: 10,
      ...params,
    },
    //     {
    //   api_key: '',
    //   search: '',
    //   location: '',
    //   radius_miles: '',
    //   page: '',
    //   jobs_per_page: '',
    //   days_ago: '',
    //   refine_by_salary: ''
    // }
  });

  return response.data;
};

const useSearchZipRecruiter = (params) => {
  return useQuery(['zipSearch'], () => searchZipRecruiter(params), {
    keepPreviousData: true,
  });
};

const SearchResults = ({ jobTitle, city, state }) => {
  const {
    isLoading,
    isError,
    data: searchResults,
    error,
  } = useSearchZipRecruiter({
    search: jobTitle,
    location: `${city}, ${state}`,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Job Search Error</div>;
  }

  return (
    <div>
      Search Results:
      <p>{JSON.stringify(searchResults, null, 2)}</p>
    </div>
  );
};

export default function Index() {
  const [val, setVal] = useState('');
  const [autocompleteInput, setAutocompleteInput] = useState();
  const [autocompleteOpen, setAutocompleteOpen] = useState();

  const [submitValues, setSubmitValues] = useState();
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      jobTitle: '',
      location: '',
    },
  });
  // const { isLoading, isError, data } = usePredictCityGoogle({
  //   input: autocompleteInput?.target?.value,
  //   enabled: autocompleteOpen,
  // });

  const onSubmit = (data) => {
    setSubmitValues({
      ...data,
      timestamp: '?',
    });
  };

  // const Autocomplete = null && window?.google?.maps?.places?.Autocomplete;
  // const autocomplete =
  //   Autocomplete && new Autocomplete(autocompleteInput?.target?.value, {});
  //
  // console.log('autocomplete', {
  //   input: autocompleteInput?.target?.value,
  //   open: autocompleteOpen,
  //   // isLoading,
  //   // data,
  //   autocomplete,
  // });

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

        {/*<Chip label="USA" onClick={() => {}} />*/}
        {/*<Chip label="UK" variant="outlined" onClick={() => {}} />*/}

        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl variant="standard" fullWidth>
            <Controller
              name="jobTitle"
              control={control}
              rules={{ required: true, minLength: 3 }}
              render={({ field, fieldState }) => (
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <AccountCircle
                    sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                  />
                  <TextField
                    label="Job title or keyword"
                    fullWidth
                    type="search"
                    {...field}
                    variant="standard"
                  />
                  {/*{JSON.stringify(fieldState)}*/}
                </Box>
              )}
            />

            <br />

            {/*<Controller*/}
            {/*  name="locationDropdown"*/}
            {/*  control={control}*/}
            {/*  render={({ field }) => (*/}
            {/*    <Autocomplete*/}
            {/*      freeSolo={false}*/}
            {/*      onInputChange={setAutocompleteInput}*/}
            {/*      onOpen={() => setAutocompleteOpen(true)}*/}
            {/*      onClose={() => setAutocompleteOpen(false)}*/}
            {/*      options={[].map((option) => option.title)}*/}
            {/*      renderInput={(params) => (*/}
            {/*        <TextField*/}
            {/*          name="location"*/}
            {/*          {...params}*/}
            {/*          {...field}*/}
            {/*          label="Search City or State"*/}
            {/*          variant="standard"*/}
            {/*        />*/}
            {/*      )}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*/>*/}

            <br />

            <PlacesAutocomplete
              value={val}
              onChange={setVal}
              onSelect={(a) => console.log('ON SELECT', a)}
              searchOptions={{
                types: ['(cities)'],
                componentRestrictions: { country: ['us', 'gb'] },
                // fields: ["address_components", "geometry", "icon", "name"],
                // components: 'country:us|country:gb',
                // cities: true,
              }}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <Controller
                  name="locationDropdown"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      freeSolo={false}
                      onInputChange={setAutocompleteInput}
                      onOpen={() => setAutocompleteOpen(true)}
                      onClose={() => setAutocompleteOpen(false)}
                      options={suggestions.map((option) => option.description)}
                      renderInput={(params) => (
                        <TextField
                          name="location"
                          {...params}
                          {...field}
                          {...getInputProps()}
                          label="Search City or State"
                          variant="standard"
                        />
                      )}
                    />
                  )}
                />
                // <div>
                //   <input
                //     {...getInputProps({
                //       placeholder: 'Search Places ...',
                //       className: 'location-search-input',
                //     })}
                //   />
                //   <div className="autocomplete-dropdown-container">
                //     {loading && <div>Loading...</div>}
                //     {suggestions.map((suggestion) => {
                //       const className = suggestion.active
                //         ? 'suggestion-item--active'
                //         : 'suggestion-item';
                //       // inline style for demonstration purpose
                //       const style = suggestion.active
                //         ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                //         : { backgroundColor: '#ffffff', cursor: 'pointer' };
                //       return (
                //         <div
                //           {...getSuggestionItemProps(suggestion, {
                //             className,
                //             style,
                //           })}
                //         >
                //           <span>{suggestion.description}</span>
                //         </div>
                //       );
                //     })}
                //   </div>
                // </div>
              )}
            </PlacesAutocomplete>

            <br />

            {/*<Controller*/}
            {/*  name="city"*/}
            {/*  control={control}*/}
            {/*  render={({ field }) => (*/}
            {/*    <TextField*/}
            {/*      label="City"*/}
            {/*      {...field}*/}
            {/*      type="search"*/}
            {/*      variant="standard"*/}
            {/*    />*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<Controller*/}
            {/*  name="state"*/}
            {/*  control={control}*/}
            {/*  render={({ field }) => (*/}
            {/*    <TextField*/}
            {/*      label="State"*/}
            {/*      type="search"*/}
            {/*      {...field}*/}
            {/*      variant="standard"*/}
            {/*    />*/}
            {/*  )}*/}
            {/*/>*/}

            <Button type="submit" variant="contained">
              Search Jobs
            </Button>
          </FormControl>
        </form>

        {/*{submitValues && (*/}
        {/*  <SearchResults*/}
        {/*    jobTitle={submitValues.jobTitle}*/}
        {/*    city={submitValues.city}*/}
        {/*    state={submitValues.state}*/}
        {/*  />*/}
        {/*)}*/}
      </Box>
    </Container>
  );
}
