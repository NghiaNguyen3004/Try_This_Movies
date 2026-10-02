# Try This Movies

> A movie recommendation web application that suggests films by genre and lets registered users save their recommendation history and rate films.

<!--
README EDITING GUIDE
Replace every [TODO: ...] placeholder with project-specific information.
Delete these HTML comments when you publish the README if you no longer need them.
-->

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [Features](#features)
- [System Design](#system-design)
- [Technology Stack](#technology-stack)
- [Database](#database)
- [Known Limitations](#known-limitations)
- [Possible Future Features](#possible-future-feature)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

Try This Movies helps users discover a film when they are not sure what to watch. Users select one or more genres, receive a recommendation sourced from TMDB, and can request another recommendation.

Guests can receive recommendations without creating an account. Registered users can rate films and view a paginated history of their recommendations. Recommendations made as a guest can be associated with the user's account when they register or log in.

**Project status:** [` MVP `]

## Demo

- [Try it out here] : (https://try-this-movies-1.onrender.com/)

## Features

- Select one or more movie genres.
- Receive movie recommendations based on the selected genres.
- Request another recommendation without leaving the recommendation page.
- Use the application as a guest with a temporary guest history.
- Register and log in with cookie-based authentication.
- Automatically associate guest recommendations with a registered account after login or registration.
- Rate recommended films from one to five stars.
- View recommendation history with pagination.
- Fetch film metadata and posters from [TMDB](https://www.themoviedb.org/).

## System Design

<!--
PLACE YOUR SYSTEM-DESIGN IMAGE HERE.

Recommended steps:
1. Create a diagram showing the frontend, backend API, PostgreSQL database,
   authentication flow, and TMDB integration.
2. Save the image as `docs/system-design.png` (or use an image URL).
3. Replace the placeholder below with:

   ![Try This Movies system design](docs/system-design.png)

You can also add a short explanation below the image describing the data flow.
-->

![System design diagram placeholder](docs/system-design.png)

**Suggested data flow:** The React frontend sends requests to the Express backend. The backend authenticates users with JWT cookies, stores users, films, recommendations, and ratings in PostgreSQL through Drizzle ORM, and retrieves movie data from TMDB when a recommendation is requested.

## Technology Stack

### Frontend

- React
- React Router
- Vite
- CSS Modules

### Backend

- Node.js
- Express
- JSON Web Tokens (JWT)
- bcrypt
- cookie-parser
- Drizzle ORM

### Data and external services

- PostgreSQL
- TMDB API
- Drizzle Kit database migrations


## Database

The PostgreSQL database contains the following main tables:

- `users` — account credentials and profile information.
- `films` — cached TMDB film metadata.
- `recommendations` — films recommended to users or guests.
- `rating` — user ratings from 1 to 5, with one rating per user and film.

Database schema changes are stored in `backend/drizzle/` and are managed with Drizzle Kit.

## Known Limitations

- The application depends on the availability and response format of the TMDB API.
- The frontend proxy target is currently configured in `frontend/vite.config.js` and should be updated for each deployment environment.
- Film recommendation doesn't have any algorithm implemented into it right now.
- The features are still simple and could expand with more feature.

## Possible Future Features
- Adding in more custom filter for people to choose what they are in the mood for (Ex. Era, Actor, etc)
- Implementing agentic AI to actually recommend film based on previous films.


## Contributing

Contributions are welcome.

1. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make and test your changes.
3. Run the relevant lint and build commands.
4. Open a pull request with a clear description of the change.

Please [TODO: Add contribution guidelines, code style rules, or issue-tracking link].

## License

This project is licensed under the [TODO: Add license name] license. See [LICENSE](LICENSE) for details.

## Acknowledgements

- Film metadata and images are provided by [TMDB](https://www.themoviedb.org/).