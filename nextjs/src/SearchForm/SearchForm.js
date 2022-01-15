import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PlacesAutocomplete from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';

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

const placesAutocomplete = {
  types: ['(cities)'],
  componentRestrictions: { country: ['us', 'gb'] },
};

const SearchForm = ({
  onSearch,
  search = '',
  location = '',
  radius = '',
  daysAgo = '',
}) => {
  const [placesAuto, setPlacesAuto] = useState('');
  const {
    control,
    handleSubmit,
    setValue,
    register,
    getValues,
    watch,
    formState: { errors },
    clearErrors,
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

  const clearLocation = (_, value) => {
    if (value) return;
    setPlacesAuto('');
    setLocation(null);
  };

  const onSubmit = (data) => {
    let searchLocation = location.endsWith(', USA')
      ? data.location.split(', USA')[0]
      : data.location;

    onSearch({
      ...data,
      searchLocation,
      timestamp: '?',
    });
  };

  const setLocation = (_, value) => {
    setValue('location', value);
    if (isValid()) {
      onSubmit(getValues());
      clearErrors();
    }
  };

  const hasErrors = useMemo(
    () => Object.keys(errors).length > 0,
    [errors.location, errors.jobTitle]
  );

  useEffect(() => {
    register('location', { required: true });
  }, [register]);

  useEffect(() => {
    if (isValid()) {
      onSubmit(getValues());
    }
  }, [radiusMiles, postedTime]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="search-form">
      <FormControl variant="standard" fullWidth>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 3,
          }}
        >
          <Controller
            name="jobTitle"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField
                  label="Job title or keyword"
                  fullWidth
                  type="search"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  {...field}
                />
              </Box>
            )}
          />

          <PlacesAutocomplete
            value={placesAuto}
            onChange={setPlacesAuto}
            searchOptions={placesAutocomplete}
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
                    defaultValue={location}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        {...getInputProps()}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon
                                sx={{
                                  color: 'action.active',
                                  mr: 1,
                                  my: 0.5,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        label="City or state"
                        variant="outlined"
                      />
                    )}
                  />
                )}
              />
            )}
          </PlacesAutocomplete>
        </Box>

        <Box
          sx={{
            marginY: 3,
            display: 'flex',
            flexDirection: 'row',
            columnGap: 3,
            justifyContent: {
              xs: 'space-evenly',
              sm: 'end',
            },
          }}
        >
          <Controller
            name="radiusMiles"
            control={control}
            render={({ field }) => (
              <FormControl variant="outlined">
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
              <FormControl variant="outlined">
                <InputLabel>Posted time</InputLabel>
                <Select {...field} label="Posted time">
                  {postedTimeOptions.map((option) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {hasErrors ? (
          <Box
            sx={{
              textAlign: 'center',
              marginBottom: 2,
              marginTop: 2,
            }}
          >
            <Typography variant="h6" color="warning.main">
              Complete the form to find your dream job!
            </Typography>
          </Box>
        ) : (
          ''
        )}

        <Box
          sx={{ width: 300, marginX: 'auto', marginTop: 1, marginBottom: 3 }}
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ textTransform: 'none', boxShadow: 0, borderRadius: 30 }}
          >
            Search Jobs
          </Button>
        </Box>
      </FormControl>
    </form>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func,
  search: PropTypes.string,
  location: PropTypes.string,
  radius: PropTypes.string,
  daysAgo: PropTypes.string,
};

export default SearchForm;
