[![Node.js CI](https://github.com/TeoSlayer/LPR-Dashboard/actions/workflows/node.js.yml/badge.svg)](https://github.com/TeoSlayer/LPR-Dashboard/actions/workflows/node.js.yml)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

A minimalist Dashboard for viewing images captured by LPR Cameras(Tested with Hikvision). REQUIRES A SEPARATE FTP SERVER ! Point the FTP Server to the public folder of the project. Every time a new image is pushed through FTP, the local sqlite3 db is updated and it can be viewed in the dashboard. Also provides a minimalist REST api to output all the recent captures in a JSON file.

Stack: NEXT.js, JS, Sqlite
