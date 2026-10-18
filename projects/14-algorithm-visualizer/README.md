# Project 14 — JavaScript Algorithm Visualizer

Interactive visualizer for sorting, searching, and data structure algorithms.

## Features

- Sorting: Bubble Sort, Quick Sort
- Searching: Binary Search, Linear Search
- Data Structures: Stack, Queue
- Step-by-step execution
- Time complexity display
- Adjustable speed
- Visual representation

## Technology Stack

- JavaScript (ES2022+)
- HTML Canvas / DOM
- Pure implementation (no frameworks)

## Installation

Open `src/index.html` in a browser.

## Usage

1. Select algorithm
2. Set input size/data
3. Click "Start"
4. Use controls: Play, Pause, Step, Speed

## Algorithms

**Sorting**
- Bubble Sort: O(n²)
- Quick Sort: O(n log n)

**Searching**
- Binary Search: O(log n)
- Linear Search: O(n)

**Data Structures**
- Stack: O(1) push/pop
- Queue: O(1) enqueue/dequeue

## Testing

```bash
node --test tests/algorithms.test.js
```

## Known Limitations

- Basic visualizations
- Limited algorithm set
- No custom comparators
- Fixed animation speed range
