-- FamilyCFO Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create application-specific schemas if needed
CREATE SCHEMA IF NOT EXISTS public;

-- Set timezone to UTC for consistency
SET timezone = 'UTC';

-- Create a dedicated user for the application (optional)
-- CREATE USER familycfo_app WITH PASSWORD 'app_password';
-- GRANT ALL PRIVILEGES ON DATABASE familycfo TO familycfo_app;
-- GRANT ALL PRIVILEGES ON SCHEMA public TO familycfo_app;

-- Enable Row Level Security (RLS) for future use
ALTER DATABASE familycfo SET "app.jwt_secret" TO 'your-jwt-secret-key-here';

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'FamilyCFO database initialized successfully';
    RAISE NOTICE 'Database: %', current_database();
    RAISE NOTICE 'User: %', current_user;
    RAISE NOTICE 'Timezone: %', current_setting('timezone');
END $$; 