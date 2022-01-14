import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from './Link';
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlacesAutocomplete from 'react-places-autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as React from 'react';

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

const SearchForm = ({ onSearch, search, location, radius, daysAgo }) => {
  const [val, setVal] = useState('');
  const router = useRouter();

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
      jobTitle: search,
      location: location,
      locationSearchText: '',
      radiusMiles: radius || radiusMilesOptions[3].value,
      postedTime: daysAgo || postedTimeOptions[0].value,
    },
  });
  const radiusMiles = watch('radiusMiles');
  const postedTime = watch('postedTime');

  // formState.isValid is broken :(
  const isValid = () => {
    const { jobTitle, location } = getValues();
    return !!(jobTitle && location);
  };

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

    onSearch({
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
      </Box>
    </Container>
  );
};

export default SearchForm;
