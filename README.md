# Giselle-10-11-21
Crypto Exchange Order Book web app built with Typescript and React.

## Demo
[giselle-10-11-21.vercel.app/](https://giselle-10-11-21.vercel.app/)

## Tech stack
 - React / Typescript
 - SASS / styled-components
 - WebSockets / react-use-websocket
 - react-testing-library
## Feature set
 - Totals
 - Spread
 - Sorting of the orderbook
 - Depth graph
 - Zero size levels are removed from the orderbook
 - Grouping Select Box: change between (0.5, 1, 2.5) for XBTUSD market and (0.5, 1, 2.5) for ETHUSD market
 - Toggle Feed Button: Switching between markets PI_XBTUSD and PI_ETHUSD
 - Kill Feed Button: stops and renew the feed when clicked
### Running the app locally

To run the app, follow these steps.

1. From project folder:

To install dependencies:
```shell
  yarn install
```
To run the app:

```shell
  yarn start
```

To run the tests:

```shell
  yarn test
```

### Notes
Some optimization and improvements can be implemented:

- Refactor some types to use generics and better naming
- Implement error handling
- Add transitions animation for toggle and depth graph
- Improve performance for big volume of updates
