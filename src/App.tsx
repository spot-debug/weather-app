import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WeatherApp from './components/WeatherApp'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <WeatherApp />
      </div>
    </QueryClientProvider>
  )
}

export default App