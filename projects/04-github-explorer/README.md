# Project 04 — GitHub Profile Explorer

Explore GitHub users and repositories using the public GitHub REST API.

## Features

- User profile search
- Public repositories list
- Repository details and language stats
- Followers/following counts
- Loading states and pagination
- Rate limit handling
- Network error handling
- No authentication required

## Technology Stack

- JavaScript (ES2022+)
- GitHub REST API v3
- Fetch API

## Installation

Open `src/index.html` in a modern browser.

## Usage

1. Enter a GitHub username
2. Click "Search"
3. View profile and repositories
4. Click repositories for details

## API

Uses GitHub REST API (public endpoints):
- No authentication for basic usage
- Rate limit: 60 requests/hour (unauthenticated)
- https://docs.github.com/en/rest

## Testing

```bash
node --test tests/github.test.js
```

## Known Limitations

- 60 req/hour rate limit without auth token
- Public data only
- No advanced search filters
