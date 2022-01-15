import axios from 'axios';
import { useQuery } from 'react-query';

export const JOBS_PER_PAGE = 15;

export const searchZipRecruiter = async (params = {}) => {
  const response = await axios.get('https://api.ziprecruiter.com/jobs/v1', {
    params: {
      api_key: process.env.NEXT_PUBLIC_ZIP_RECRUITER_API_KEY,
      page: 1,
      jobs_per_page: JOBS_PER_PAGE,
      ...params,
    },
  });

  return response.data;
};

export const useSearchZipRecruiter = (params) => {
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
