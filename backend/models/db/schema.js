import { pgTable, serial, text, integer, smallint, timestamp, array } from 'drizzle-orm/pg-core';


// USERS
const users = pgTable('users', {
  id: serial('userid').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  hashPassword: text('hash_password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// FILMS
const films = pgTable('films', {
  id: serial('id').primaryKey(),
  tmdbId: integer('tmdb_id').unique(),        // unique so recommendations can FK to it
  title: text('title').notNull(),
  genre: text('genre').array(),
  releaseYear: smallint('release_year'),
  posterUrl: text('poster_url'),
  description: text('description'),
})

// RECOMMENDATIONS
const recommendations = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),          // FK → users ✅
  guestId: text('guest_id'),                                       // text, not integer ✅
  filmTmdbId: integer('film_tmdb_id').references(() => films.tmdbId), // FK → films.tmdb_id ✅
  genreSearched: text('genre_searched').array(),
  recommendedAt: timestamp('recommended_at').defaultNow(),
})

// RATING
const rating = pgTable('rating', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),  // FK → users ✅
  filmId: integer('film_id').notNull().references(() => films.id),  // FK → films ✅
  score: smallint('score').notNull(),                               // notNull ✅
  ratedAt: timestamp('rated_at').defaultNow(),
})

module.exports = { users, films, recommendations, rating }