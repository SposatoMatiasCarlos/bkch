# BKCH Frontend

This is the React + Vite frontend for the BKCH project.

## Manual run

```bash
cd project/frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Production preview

```bash
cd project/frontend
npm install
npm run build
npm run preview
```

The preview server will start on `http://localhost:4173` by default.

## Docker

Build the Docker image:

```bash
docker build -t bkch-frontend project/frontend
```

Run the container:

```bash
docker run --rm -p 80:80 bkch-frontend
```

Open `http://localhost`.
