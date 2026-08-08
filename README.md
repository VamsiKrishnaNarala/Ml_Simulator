# ML Lab — Machine Learning, You Can See

An interactive, 100% frontend Machine Learning education platform. Every algorithm is implemented
from scratch in TypeScript and trained live in the browser — no backend, no database, no external
ML API.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- react-router-dom
- Canvas-based visualizations (no charting library dependency for the core plots)
- LocalStorage only, for quiz score / lesson progress

## What's inside

- **Home** — landing page with an animated live decision-boundary hero
- **Learn ML** — progressive modules: what is ML, datasets, train/test split, classification,
  regression, clustering (with an editable dataset table and a live split slider)
- **Playground** — three real, interactive labs:
  - **Classify**: KNN, Logistic Regression, Decision Tree, Naive Bayes, linear SVM, Random Forest,
    all trained on synthetic datasets (blobs / moons / circles / linear / XOR / noise) you can
    reshape. Click the canvas to drop points or (for KNN) a query point; see neighbors, votes, and
    the live decision boundary.
  - **Regress**: Linear regression trained via real batch gradient descent, scrubbable/animatable
    iteration-by-iteration, with live MSE and equation.
  - **Cluster**: K-Means with step-by-step or run-to-convergence controls, and drag-able centroids.
- **Algorithms** — every algorithm explained three ways: simple, visual (step chips), and
  mathematical.
- **Compare** — runs several classifiers side by side on the identical dataset and train/test
  split, with a live metrics table.
- **Quiz** — multiple-choice questions with immediate explanations; best score saved locally.
- **About** — what this project is and isn't.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm install
npm run build
npm run preview   # optional, serves the production build locally
```

Output goes to `dist/`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, "Add New Project" → import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. No environment variables are required.
5. Deploy.

## Notes on the "ML"

Everything is a genuine, if compact, implementation:

- **KNN** — brute-force Euclidean distance + majority vote.
- **Logistic Regression** — sigmoid + batch gradient descent on cross-entropy loss.
- **Decision Tree** — recursive CART-style splitting on Gini impurity.
- **Naive Bayes** — Gaussian likelihoods per feature per class.
- **Linear SVM** — sub-gradient descent on hinge loss (soft margin).
- **Random Forest** — bootstrap-aggregated shallow decision trees.
- **Linear Regression** — batch gradient descent on MSE, with full iteration history for
  animation/scrubbing.
- **K-Means** — Lloyd's algorithm (assign → recompute centroid → repeat).

Datasets (blobs, two moons, circles, linearly separable, XOR, random noise) are generated with a
seeded PRNG so results are reproducible per seed, and regenerable on demand.
