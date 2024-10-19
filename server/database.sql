CREATE DATABASE todoapp;

CREATE TABLE todos (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES users(email),
  title VARCHAR(30) NOT NULL,
  progress INT NOT NULL,
  date VARCHAR(300)
);

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  hashed_password VARCHAR(255)
);