/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `booking_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `course` (text)
      - `additional_info` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create booking_requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  course text NOT NULL,
  additional_info text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" 
  ON users 
  FOR SELECT 
  TO public 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
  ON users 
  FOR UPDATE 
  TO public 
  USING (auth.uid() = id);

-- Create policies for booking_requests table
CREATE POLICY "Users can insert their own requests" 
  ON booking_requests 
  FOR INSERT 
  TO public 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own requests" 
  ON booking_requests 
  FOR SELECT 
  TO public 
  USING (auth.uid() = user_id);