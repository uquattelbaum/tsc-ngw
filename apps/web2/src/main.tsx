import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const qc = new QueryClient();

function Health() {
  const { data, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => (await fetch('http://127.0.0.1:8787/health', { credentials: 'include' })).json()
  });
  if (isLoading) return <div>Lade…</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <Health />
    </QueryClientProvider>
  </React.StrictMode>
);
