import './App.css'
import { Routes, Route, Navigate, Form } from 'react-router-dom';
import HomePage from './pages/HomePage'
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import AuthPage from './pages/AuthPage';
import SetProfilePage from './pages/SetProfilePage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <SignedOut>
              <SignInButton>Sign In</SignInButton>
            </SignedOut>
            <SignedIn>
              {/* Redirect to check-auth so logic is handled there */}
              <Navigate to="/check-auth" />
            </SignedIn>
          </>
        } />

        <Route path="/check-auth" element={
          <>
            <SignedOut>
              <SignInButton  >
                Sign In
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <AuthPage />
            </SignedIn>
          </>
        } />
        <Route path="/form" element={
          <>
            <SignedOut>
              <SignInButton>Sign In</SignInButton>
            </SignedOut>
            <SignedIn>
              <SetProfilePage />
            </SignedIn>
          </>
        } />
        <Route path="/home" element={
          <>
            <SignedOut>
              <SignInButton>Sign In</SignInButton>
            </SignedOut>
            <SignedIn>
              <HomePage />
            </SignedIn>
          </>
        } />

      </Routes>
    </>
  )
}

export default App
