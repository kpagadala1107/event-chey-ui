import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await authApi.googleLogin(credentialResponse.credential);
      login(response.token, response.user);
      toast.success('Successfully logged in with Google!');
      navigate('/events');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  const handleFacebookLogin = async () => {
    // Facebook Login SDK implementation
    window.FB.login((response) => {
      if (response.authResponse) {
        handleFacebookSuccess(response.authResponse.accessToken);
      } else {
        toast.error('Facebook login failed');
      }
    }, { scope: 'public_profile,email' });
  };

  const handleFacebookSuccess = async (accessToken) => {
    setIsLoading(true);
    try {
      const response = await authApi.facebookLogin(accessToken);
      login(response.token, response.user);
      toast.success('Successfully logged in with Facebook!');
      navigate('/events');
    } catch (error) {
      console.error('Facebook login error:', error);
      toast.error(error.response?.data?.message || 'Failed to login with Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authApi.login(formData.email, formData.password);
      login(response.token, response.user);
      toast.success('Successfully logged in!');
      navigate('/events');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <CalendarDaysIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Event-Chey
            </h1>
            <p className="text-gray-600">
              Sign in to manage and attend events
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>

            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Email Login Toggle */}
          {!showEmailLogin ? (
            <button
              onClick={() => setShowEmailLogin(true)}
              className="w-full text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Sign in with email
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Sign In
              </Button>
              <button
                type="button"
                onClick={() => setShowEmailLogin(false)}
                className="w-full text-gray-600 hover:text-gray-700 font-medium text-sm"
              >
                Back to social login
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              By signing in, you agree to our{' '}
              <button className="text-indigo-600 hover:text-indigo-700 underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-indigo-600 hover:text-indigo-700 underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
