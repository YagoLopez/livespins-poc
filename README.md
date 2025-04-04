# Livespins Proof of Concept By Yago López

```bash
npm run        # list available scripts
npm run dev    # run development server
npm run lint   # run linter
npm run build  # production build
npm run test   # run tests
```

## Install and run

- Clone the repo
- Run `npm install`
- Run `npm run dev` and Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo

https://livespins-poc.vercel.app/

## Test Coverage

https://yagolopez.js.org/livespins-poc/coverage/lcov-report/index.html

## Backend

There is an **endpoint** available for game search at https://livespins-poc.vercel.app/api/search?search=megaways&page=1. If we pass and empty search string the endpoint returns all games paginated.

## Folder Structure

- `/pages`: page components
- `/pages/api/search` : search games endpoint
- `/pages/api/lib` : data abstraction layer
- `/components`: it contains general components
- `/redux`: state management files
- `/public`: static assets
- etc.

## Tech Stack and Dependencies

- React
- Typescript
- NextJS: server side rendering
- React-Query: data fetching library
- Redux Toolkit: state management
- Search Array Library: to search data in JSON
- Tailwind: CSS framework
- Tw Elements: Tailwind components library

## Architecture and functionality

- **State Management**
  - Asynchronous State Management using React Query. Async data coming from server is saved in a cache in the client
  - Synchronous State Management
    - When a user clicks and selects a game in the lobby, the game and the scrolled games are saved into Redux store
    - When the user comes back from game detail page to games lobby the `scrolled games state is restored` and the `selected game is scrolled into viewport`.

- **Separation of Concerns**: *Data Abstraction Layer* for decoupling frontend from backend. The usage of interfaces and the repository pattern allows to decouple frontend and backend. Since frontend interacts with interfaces, just changing the interfaz implemetation allows to use a different data source. For instance, we could change to a MongoDB database for games data without changing frontend code. Only the implementation of the repository for the MongoDB connection.

  In the project, there are two repositories:

  - `GamesRepository`: get game data from a real endpoint
  - `GamesRepositoryMock`: return mock game data

  Since both repositories are implementations of same interface you can exchange them in the code or tests and the app won't brake since the interface contract is kept

- **Dependency Injection**: The `<Lobby/>` Page Component gets by prop an `IRepository`, so you can inject any implementation of the `IRepository`, that is, you can pass an instance of the`GamesRepository` or `GamesRepositoryMock` classes as dependency

- **Usage of Intersection Observer for INFINITE SCROLL**. When the user scrolls down and the bottom of the list appears into viewport, the next page is loaded. We are able to achieve this by defining an IntersectionObserver on a DOM element at the bottom of the game list
