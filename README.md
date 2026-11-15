# DevScope

DevScope is a front-end project for helping recruiters discover developers through their public GitHub profiles and keep promising candidates in a shortlist.

## Project goal

The target workflow is:

1. Search for a GitHub username.
2. Review the developer's profile and public repositories.
3. Add the developer to a shortlist stored through a REST API.
4. Search and sort the saved candidates.

The project brief specifies a mobile-first interface with three pages, GitHub API requests, MockAPI persistence, clear loading and error states, and modular JavaScript.

## Pages

| Page | File | Purpose |
|---|---|---|
| Search | `index.html` | Enter a GitHub username and open the profile page. |
| Profile | `profiles.html` | Review profile information and public repositories. |
| Shortlist | `shortList.html` | View and manage saved candidates. |

The current search form uses the `query` URL parameter (for example, `profiles.html?query=octocat`).

## Technology

- HTML
- Tailwind CSS browser CDN
- JavaScript ES modules
- GitHub REST API for public profile and repository data
- MockAPI REST endpoint for candidate records

## Run locally

Because the pages use JavaScript modules, open the project through a local HTTP server rather than opening the HTML files directly. For example, use the Live Server extension in Visual Studio Code, then open `index.html` through its local URL.

## File structure

```text
.
├── index.html          # Search page
├── index.js            # Search page behavior
├── profiles.html       # Developer profile page
├── profiles-ui.js      # Profile and repository rendering
├── shortList.html      # Candidate shortlist page
├── shortList.js        # Shortlist rendering
├── api.js              # GitHub API helpers
├── mockApi.js          # MockAPI GET and POST helpers
└── validation.js       # Reserved for username validation
```

## API flow

`api.js` contains asynchronous fetch helpers for GitHub profile, repository, follower, following, subscription, and repository-language data. `mockApi.js` reads candidate records and sends new candidates with a JSON POST request. The shortlist flow is intended to check for an existing login before adding a candidate.

GitHub may limit unauthenticated requests. The brief calls for clear handling of not-found, rate-limit, and network errors, with a loading indicator and a retry option where appropriate.

## Current implementation status

The checked-in files provide page shells, GitHub fetch helpers, MockAPI GET/POST helpers, and profile/shortlist rendering scaffolding. The project is an early implementation and should not yet be treated as meeting every brief requirement.

Before presenting it as complete, finish and verify at least these items:

- Validate usernames before sending a request: 1–39 letters, numbers, or hyphens; no hyphen at either end.
- Replace hard-coded profile details with GitHub response data and provide defaults for missing values.
- Add loading indicators and distinct not-found, rate-limit, and network error states, including retry behavior.
- Implement shortlist search and sorting, an accurate candidate count, and an empty state.
- Prevent duplicate additions and show the result of a successful or failed save.
- Render API data with safe DOM methods such as `createElement` and `textContent`; avoid inserting untrusted API data with `innerHTML`.
- Check the responsive layout, keyboard accessibility, image alt text, and HTML validity.
- Complete and verify the README, Jira board, Git history, and deployment before final delivery.

The repository's current `validation.js` is empty. The shortlist search and sorting controls are not yet wired up, and some profile content is hard-coded in `profiles-ui.js`.

## Optional enhancements

After the required stories work, add repository search, language filters, sorting, pagination by six repositories, and a GitHub rate-limit indicator. These operations should use already-loaded repository data rather than making another request for each interaction.

## Sprint brief

The brief schedules five days of individual work, from 9 to 13 November 2026, with submission due before 23:59 on 13 November. The requested demonstration includes a profile search, repository review, shortlist addition, candidate search and sorting, and an induced error such as a 404 or offline request.
