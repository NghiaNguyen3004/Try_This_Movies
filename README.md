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
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [Screenshots](#screenshots)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

Try This Movies helps users discover a film when they are not sure what to watch. Users select one or more genres, receive a recommendation sourced from TMDB, and can request another recommendation.

Guests can receive recommendations without creating an account. Registered users can rate films and view a paginated history of their recommendations. Recommendations made as a guest can be associated with the user's account when they register or log in.

**Project status:** [TODO: Add `In development`, `MVP`, `Deployed`, or another status]

## Demo

- **Live application:** [TODO: Add deployed frontend URL]
- **Backend/API:** [TODO: Add deployed backend URL]
- **Demo account:** [TODO: Add instructions, or remove this line]

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

## Project Structure

```text
Try_This_Movies/
├── backend/
│   ├── controller/       # Request handlers for recommendations, ratings, and history
│   ├── middleware/       # Authentication and guest identity middleware
│   ├── models/           # Database schema, queries, and TMDB integration
│   ├── routes/           # Authentication and film API routes
│   ├── drizzle/          # Generated PostgreSQL migrations
│   ├── server.js         # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared and route-guard components
│   │   ├── context/      # Authentication state
│   │   ├── pages/        # Login, registration, genre, recommendation, and history pages
│   │   └── utils/        # API request helper
│   ├── public/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following before setting up the project:

- Node.js [TODO: Add the supported version]
- npm
- PostgreSQL, or a hosted PostgreSQL database
- A TMDB API key

### 1. Clone the repository

```bash
git clone [TODO: Add repository URL]
cd Try_This_Movies
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file using the template in [Environment Variables](#environment-variables).

Run the database migrations:

```bash
npm run db:migrate
```

### 3. Configure and start the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Start the backend

From the `backend` directory:

```bash
npm run dev
```

Open the frontend URL displayed by Vite in your browser.

> The frontend currently proxies `/auth` and `/films` requests to the configured backend deployment in `frontend/vite.config.js`. Update that proxy target when using a different local or deployed backend.

## Environment Variables

Create `backend/.env` and do not commit it to version control:

```env
# PostgreSQL connection string
DB_URL=postgresql://<username>:<password>@<host>:<port>/<database>

# Used to sign authentication tokens
JWT_SECRET=<long-random-secret>

# Optional; defaults to 10 in the current backend
BCRYPT_SALT_ROUNDS=10

# TMDB API configuration
TMDB_API_KEY=<your-tmdb-api-key>
TMDB_BASE_URL=https://api.themoviedb.org/3

# Optional server configuration
PORT=3000
NODE_ENV=development
```

**Important:** Use a strong, unique `JWT_SECRET` in every deployed environment. Never expose backend environment variables in the frontend or commit secrets to the repository.

## API Overview

The backend exposes the following routes:

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Guest or anonymous | Create an account |
| `POST` | `/auth/login` | Guest or anonymous | Authenticate an existing user |
| `POST` | `/auth/logout` | Optional | Clear the authentication cookie |
| `GET` | `/auth/me` | Optional | Return the current user |
| `GET` | `/films/genres` | Optional | Return available genres |
| `GET` | `/films/recommend?genre=...` | Guest or authenticated | Get a recommendation |
| `GET` | `/films/history?page=1&limit=20` | Required | Get the user's recommendation history |
| `POST` | `/films/rate` | Required | Rate a film from 1 to 5 |
| `GET` | `/health` | Anonymous | Check whether the backend is running |

Example rating request:

```json
{
  "filmTmdbId": 12345,
  "score": 5
}
```

## Database

The PostgreSQL database contains the following main tables:

- `users` — account credentials and profile information.
- `films` — cached TMDB film metadata.
- `recommendations` — films recommended to users or guests.
- `rating` — user ratings from 1 to 5, with one rating per user and film.

Database schema changes are stored in `backend/drizzle/` and are managed with Drizzle Kit.

## Available Scripts

### Backend

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend with Node's watch mode |
| `npm start` | Start the backend |
| `npm run db:generate` | Generate a Drizzle migration from schema changes |
| `npm run db:migrate` | Apply migrations to the configured database |
| `npm run db:studio` | Open Drizzle Studio |

### Frontend

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Screenshots

<!--
Add screenshots here to show the main user flows. Recommended images:
- `docs/screenshots/genre-picker.png`
- `docs/screenshots/recommendation.png`
- `docs/screenshots/login.png`
- `docs/screenshots/history.png`
-->

### Genre selection

![Genre selection screenshot](docs/screenshots/genre-picker.png)

### Recommendation page

![Recommendation page screenshot](docs/screenshots/recommendation.png)

### Recommendation history

![Recommendation history screenshot](docs/screenshots/history.png)

## Known Limitations

- [TODO: Document current limitations, such as deployment constraints or incomplete error handling.]
- The application depends on the availability and response format of the TMDB API.
- The frontend proxy target is currently configured in `frontend/vite.config.js` and should be updated for each deployment environment.
- [TODO: Add testing status once automated tests are available.]

## Roadmap

- [ ] Add automated frontend and backend tests.
- [ ] Improve recommendation filtering and personalization.
- [ ] Add richer film details and trailers.
- [ ] Add user profile and rating management.
- [ ] Add production environment configuration.
- [ ] [TODO: Add your next project milestone]

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
- [TODO: Add libraries, tutorials, collaborators, or other credits.]