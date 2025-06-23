# ADR-0001: State Layer with Zustand

## Context

This project requires a robust, scalable, and ergonomic state management solution for a production-grade React + TypeScript crypto trading SPA. The state layer must support:

- High-frequency market data (order book, klines, etc.)
- Persistent user/session state (positions, open orders, selected instrument, etc.)
- Performance and modularity
- Type safety and developer experience

## Decision

We choose [Zustand](https://github.com/pmndrs/zustand) as the primary state management library for both market data and persistent user state.

## Rationale

- **Simplicity**: Zustand provides a minimal, intuitive API with no boilerplate, making it easy to define and update state.
- **Performance**: Zustand uses shallow comparison and selector-based subscriptions, minimizing unnecessary re-renders, which is critical for high-frequency updates (e.g., order book, price ticks).
- **TypeScript Support**: Zustand offers first-class TypeScript support, enabling type-safe stores and actions.
- **Persistence**: Zustand supports middleware for localStorage/sessionStorage persistence, which is used for positions, open orders, and user preferences.
- **Modularity**: Zustand stores can be split into multiple slices (e.g., marketStore, exchangeStore), supporting separation of concerns and codebase scalability.
- **No Provider/Context Overhead**: Zustand does not require React Context or Providers, reducing component tree complexity and improving performance.
- **Ecosystem**: Zustand is well-maintained, widely adopted, and compatible with React 18+ and modern tooling.

## Alternatives Considered

- **Redux/Redux Toolkit**: Powerful and mature, but introduces boilerplate and complexity not needed for this project. Redux is less ergonomic for high-frequency, non-persistent state.
- **Recoil**: Good for fine-grained state, but less mature and with less ecosystem support. Persistence and SSR are less straightforward.
- **Jotai**: Simple and atomic, but Zustand's API and ecosystem are more mature for our use case.
- **React Context/Reducer**: Suitable for small apps, but not performant for high-frequency updates or large state trees.

## Consequences

- Zustand will be used for all app-level state, split into slices for market data (non-persistent, high-frequency) and user/exchange state (persistent, low-frequency).
- Local component state (`useState`) will still be used for UI-only or ephemeral state.
- The codebase will avoid Redux/Context boilerplate, improving maintainability and performance.
