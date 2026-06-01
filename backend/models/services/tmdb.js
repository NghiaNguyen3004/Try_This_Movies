// This file will handle all interactions with the TMDB API, such as fetching movie details, searching for movies, etc.
import 'dotenv/config';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  sciencefiction: 878,
  tvmovie: 10770,
  thriller: 53,
  war: 10752,
  western: 37,
}

const getGenreId = (genreNames) => {
  // accept both a single string and an array of strings
  const names = Array.isArray(genreNames) ? genreNames : [genreNames]
  
  const ids = names
    .map(name => GENRE_MAP[name.toLowerCase().replace(/\s+/g, '')])
    .filter(id => id !== undefined)
  
  return ids
}

const fetchFilmsByGenre = async (genreNames) => {
    const genreIds = getGenreId(genreNames);
    if(genreIds.length === 0){
        throw new Error('No valid genres provided');
    }
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join('|')}&sort_by=popularity.desc&include_adult=false`;
    const response = await fetch(url);
    if(!response.ok){
        throw new Error('Failed to fetch movies from TMDB');
    }
    const data = await response.json();
    return data.results.map(film => ({
        tmdbId: film.id,
        title: film.title,
        genre: film.genre_ids,
        releaseYear: film.release_date ? parseInt(film.release_date.split('-')[0]) : null,
        posterUrl: film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : null,
        description: film.overview,
  }))
};

const fetchFilmById = async (tmdbId) => {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`TMDB request failed with status ${response.status}`)
    }

    const data = await response.json()
    return {
        tmdbId: data.id,
        title: data.title,
        genre: data.genres.map(g => g.id),
        releaseYear: data.release_date ? parseInt(data.release_date.split('-')[0]) : null,
        posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        description: data.overview,
    }
};

export {fetchFilmsByGenre, fetchFilmById, getGenreId, GENRE_MAP};
