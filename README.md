# Hydrogen Demo store integrating Dynamic Yield

This demo store is a clone of the `demo-store` template [provided by Shopify](https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started/quickstart) with examples of how to integrate the Dynamic Yield APIs.

## Requirements

- A Dynamic Yield account
- [Dynamic Yield v2](https://apps.shopify.com/dynamic-yield-v2) Shopify app
- Node.js version 16.14.0 or higher

## Start the demo store locally

```bash
npm run dev
```

## Dynamic Yield API integration
The following files contain the changes related to the Dynamic Yield APIs:
- [dyapi.jsx](/app/dyapi.jsx) is added to the app directory.  This file contains some Dynamic Yield helper functions. 
- [root.jsx](/app/root.jsx) includes code to trigger pageview tracking to Dynamic Yield.  
    - The helper function `useContextFromLoaders` gets the context information from the routes. 
    - `useLocation` is used to trigger client side calls back to a new route: `/api/pv`
- [app/routes/($locale).api.pv.jsx](app/routes/($locale).api.pv.jsx) A new route to handle pageview calls and trigger calls to the Dynamic Yield API using the `reportPageView` function from dyapi.jsx.  
- [app/routes/($locale)._index.jsx](app/routes/($locale)._index.jsx) includes code to specify the Dynamic Yield 'page context' (homepage) and make a request to the choose endpoint of the Dynamic Yield API for the campaign `HP Hero`.  The data returned from the API is used to replace the default primaryHero.  
- [app/routes/($locale).products.$productHandle.jsx](app/routes/($locale).products.$productHandle.jsx) includes code to set the correct page context (product).  A placeholder call is made to the choose endpoint (no campaigns are requested yet).  
- [app/routes/($locale).products._index.jsx](/app/routes/($locale).products._index.jsx) includes code to set the correct page context (category).  A placeholder call is made to the choose endpoint (no campaigns are requested yet).  
