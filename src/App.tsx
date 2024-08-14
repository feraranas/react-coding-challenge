import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CatOwnersList from './components/CatOwnersList';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CatOwnersList />
    </QueryClientProvider>
  );
}

export default App;
