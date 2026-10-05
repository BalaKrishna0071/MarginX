# MarginX

MarginX is a trading risk and discrepancy monitoring dashboard designed to help track margin health, compare margin values across sources, and surface mismatches in positions or trades. The project combines a Python Flask backend with a React frontend to present live market-data views and generated analysis files in a single workspace.

## Overview

This application is built for operational monitoring in a trading environment. It focuses on:

- Nmass margin review
- Scenario margin comparison
- Stocks comparison and screener views
- Trades mismatch analysis
- Positions mismatch analysis
- Excel-based monitoring and live watch flows

The frontend exposes a dashboard-style navigation experience, while the backend reads generated CSV/Excel artifacts and serves them through API endpoints for the UI.

## Tech Stack

### Frontend
- React 19
- Create React App
- React Router DOM
- Material UI / Emotion styling
- Axios for API calls
- Lucide / React Icons for dashboard UI

### Backend
- Python 3.x
- Flask
- Pandas
- NumPy
- Selenium
- yfinance
- XlsxWriter
- Flask-CORS

## Project Structure

```text
MarginX/
├── Backend/
│   ├── config/
│   ├── constants/
│   ├── logs/
│   ├── mismatch_result/
│   ├── nmass_data/
│   ├── scenario_margin_data/
│   ├── stocks_data/
│   ├── app_hosting.py
│   ├── main.py
│   ├── nmass_margin_scraper.py
│   ├── positions_mismatch.py
│   ├── scenario_margin.py
│   ├── stocks_comparison.py
│   ├── trades_mismatch.py
│   ├── requirements.txt
│   └── runScript.bat
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── README.md
└── .idea/
```

## Main Features

### 1. Nmass Margin
Displays margin data pulled from generated data files and rendered for review in the dashboard.

### 2. Scenario Margin
Shows scenario-based margin calculations and comparisons used for monitoring risk assumptions.

### 3. Trades Mismatch
Compares trade data across sources and highlights potential mismatches, including supporting PnL summaries.

### 4. Positions Mismatch
Presents mismatched position records from generated comparison outputs.

### 5. Stocks Comparison
Allows comparison of stock-level data and screening-style review.

### 6. Excel Watch
Monitors file-based operational data from Excel exports and exposes it in the interface.

## Backend API Summary

The Flask app in `Backend/app_hosting.py` exposes the following endpoints:

- `GET /` — health check
- `GET /react_scenario_data` — scenario margin data
- `GET /nmass_margin_data` — Nmass margin data
- `GET /trades_mismatch_data` — trade mismatch and PnL summary
- `GET /positions_mismatch_data` — positions mismatch data
- `GET /stocks_comparison` — stock comparison data

The frontend calls these endpoints using localhost values such as `http://localhost:5001/...`.

## Development Setup

### Prerequisites

- Python 3.10+ recommended
- Node.js 18+ recommended
- npm
- Access to the generated market data files in the backend folders

### 1. Backend Setup

```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app_hosting.py
```

The Flask service runs on:

- `http://localhost:5001`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app runs on:

- `http://localhost:3000`

## Typical Developer Workflow

1. Start the backend API service.
2. Ensure the required CSV/Excel files are present in the backend data folders.
3. Start the frontend.
4. Open the dashboard and navigate through the available monitoring modules.
5. Review mismatch and margin data for the current trading window.

## Data and Script Notes

Several scripts inside the backend generate or process the dashboard data:

- `nmass_margin_scraper.py` — pulls/exports margin details
- `scenario_margin.py` — scenario margin data generation
- `trades_mismatch.py` — trade comparison logic
- `positions_mismatch.py` — position mismatch logic
- `stocks_comparison.py` — stock-scanner style data prep

These scripts are designed to work with generated files stored in the project folder structure and are useful when the app is used in a live operational workflow.

## Running the Scraper Workflow

The project includes automated scheduling logic in `Backend/app_hosting.py` and `Backend/main.py` for expiry-day monitoring windows. The scraper loop is set up to run during defined time windows and refresh market-data outputs when operational windows are active.

## Troubleshooting

- If the frontend cannot load data, confirm the backend is running on port 5001.
- If data is empty, verify the expected CSV/Excel files exist in the respective backend folders.
- If CORS issues appear, make sure the Flask app is started and `flask_cors` is installed.
- On Windows, use the `.venv\Scripts\activate` pattern for the virtual environment.

## Notes for Contributors

- Keep API and frontend contracts consistent when changing response keys.
- Prefer adding or updating feature-specific docs in the relevant module when changing data flows.
- Be careful with file paths because several parts of the project depend on generated local data files.
- Use the generated data folders as the source of truth for operational outputs.

## License

This project does not currently declare a repository license in the root configuration. If this is intended for external or team use, add a project license file and document the usage terms explicitly.

## Summary

MarginX is a monitoring dashboard for trading risk, margin comparison, and mismatch detection. It is optimized for internal operational use, with a Python data-serving layer and a React frontend that gives users a fast way to review live operational data.
