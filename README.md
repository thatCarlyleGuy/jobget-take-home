#JobGet Take Home Assignment - Carlyle Ruiters

Deployment: https://jobget-take-home.vercel.app/

## Tech Used
1. Component library: **Material UI**
2. React framework: **NextJs**
3. Unit tests: **Jest + @testing-library/react**
4. Development: **Eslint + Prettier**
5. Services: **Google Places Autocomplete**

## Features
### Basics
Search for US and UK jobs by selected a Search Term and a City.
You can also filter by Radius and Posted Time.
Results are paginated; pages can be switched at the bottom of the list of search results.

### Url query parameters
Form state is linked to URL query parameters.
This makes our app sharable and persistent across page reloads.

### Autocomplete
Leverages Google's Places API to autocomplete city searches.

### TODO:
Mobile friendly layout by default but autoscrolls to search results would be welcomed on mobile.
