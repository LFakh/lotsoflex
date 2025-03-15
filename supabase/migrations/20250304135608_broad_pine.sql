-- Create databases
CREATE DATABASE netflix_users;
CREATE DATABASE netflix_content;
CREATE DATABASE netflix_recommendations;

-- Connect to netflix_users database
\c netflix_users;

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Connect to netflix_content database
\c netflix_content;

-- Create genres table
CREATE TABLE genres (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Connect to netflix_recommendations database
\c netflix_recommendations;

-- Create activity_types enum
CREATE TYPE activity_type AS ENUM ('VIEW', 'LIKE', 'DISLIKE', 'ADD_TO_LIST', 'WATCH');