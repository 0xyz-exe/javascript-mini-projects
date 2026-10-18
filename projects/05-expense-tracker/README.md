# Project 05 — Expense Tracker

Personal finance tracker for income and expenses.

## Features

- Add income/expense transactions
- Categories and descriptions
- Monthly totals and summaries
- Category breakdown
- Filtering and sorting
- CSV/JSON export
- Local persistence (localStorage)
- Data validation

## Technology Stack

- JavaScript (ES2022+)
- localStorage for persistence

## Installation

Open `src/index.html` in a modern browser.

## Usage

1. Select type (Income/Expense)
2. Enter amount, category, description
3. Click "Add"
4. View summary and transactions
5. Export data via CSV/JSON
6. Import previous exports

## Testing

```bash
node --test tests/expense.test.js
```

## Known Limitations

- No cloud sync
- No recurring transactions
- No budget alerts
- No receipt attachments
