import { BrowserRouter, Route, Routes } from '@esmo/react-utils/router'
import { Suspense, lazy } from 'react'

import { PrivateRoute } from './routes/private.route'
import { PublicRoute } from './routes/public.route'
import { Loading } from './components/loading.component'
import { QueryProvider } from '@esmo/react-utils/state'
import DestinationsView from './views/destination.view'

const SignInView = lazy(() => import('./views/sign-in.view'))
const SignUpView = lazy(() => import('./views/sign-up.view'))
const DashboardView = lazy(() => import('./views/dashboard.view'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" children={<PrivateRoute children={<DashboardView />} />} />
            <Route path="/destinations/:id" children={<PrivateRoute children={<DestinationsView />} />} />
            <Route path="/signin" children={<PublicRoute children={<SignInView />} />} />
            <Route path="/signup" children={<PublicRoute children={<SignUpView />} />} />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </Suspense>
  )
}

export default App
