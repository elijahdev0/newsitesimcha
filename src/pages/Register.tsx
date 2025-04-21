import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { Shield, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password', '');
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerUser(data.email, data.password, data.firstName, data.lastName);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
                Create Your Account
              </h1>
              <p className="text-tactical-600 text-center mb-8">
                Join Elite Tactical Training today
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-tactical-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className={`
                        w-full px-3 py-2 border rounded-md text-tactical-900
                        ${errors.firstName ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-tactical-400
                      `}
                      placeholder="John"
                      {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-tactical-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className={`
                        w-full px-3 py-2 border rounded-md text-tactical-900
                        ${errors.lastName ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-tactical-400
                      `}
                      placeholder="Doe"
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

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

                <div className="mb-4">
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

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-tactical-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`
                      w-full px-3 py-2 border rounded-md text-tactical-900
                      ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-tactical-400
                    `}
                    placeholder="••••••••"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  isLoading={isLoading}
                  className="mb-4"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>

                <div className="text-center text-sm text-tactical-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-accent-600 hover:text-accent-500 font-medium">
                    Sign in
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

export default Register;