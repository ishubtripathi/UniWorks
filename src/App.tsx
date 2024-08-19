import { Routes, Route } from 'react-router-dom';

import './globals.css';

import SigninForm from './_auth/forms/SinginForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Home } from './_root/pages';
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/*public route*/}
        <Route element = {<AuthLayout />}>
          <Route path = '/signin' element = {<SigninForm />} />
          <Route path = '/signup' element = {<SignupForm />} />
        </Route>
        
        {/*private route*/}
        <Route element = {<RootLayout/>}>
          <Route index element = {<Home />}/>
        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App