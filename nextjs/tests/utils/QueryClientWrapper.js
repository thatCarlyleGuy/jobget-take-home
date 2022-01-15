import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types,react/display-name
export default ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
