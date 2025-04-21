import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { Shield, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-tactical-100 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <Shield className="w-12 h-12 text-accent-500" />
              </div>
              <h1 className="text-2xl font-bold text-center text-tactical-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-tactical-600 text-center mb-8">
                Sign in to access your account
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-tactical-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`
                      w-full px-3 py-2 border rounded-md text-tactical-900
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-tactical-400
                    `}
                    placeholder="your@email.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-tactical-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`
                      w-full px-3 py-2 border rounded-md text-tactical-900
                      ${errors.password ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-tactical-400
                    `}
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  isLoading={isLoading}
                  className="mb-4"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>

                <div className="text-center text-sm text-tactical-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-accent-600 hover:text-accent-500 font-medium">
                    Create one now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;