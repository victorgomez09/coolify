import { BrowserRouter, Route, Routes } from '@esmo/react-utils/router'
import { Suspense, lazy } from 'react'

import { PrivateRoute } from './routes/private.route'
import { PublicRoute } from './routes/public.route'
import { LoadingComponent } from './components/loading.component'

const SignUpView = lazy(() => import('./views/sign-up.view'))
const HomeView = lazy(() => import('./views/home.view'))

function App() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" children={<PrivateRoute children={<HomeView />} />} />
          <Route path="/signup" children={<PublicRoute children={<SignUpView />} />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
