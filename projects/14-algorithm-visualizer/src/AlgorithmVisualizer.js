export class AlgorithmVisualizer {
  // Bubble Sort
  static bubbleSort(arr) {
    const steps = [];
    const data = [...arr];

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length - i - 1; j++) {
        steps.push({ type: 'compare', indices: [j, j + 1], array: [...data] });
        
        if (data[j] > data[j + 1]) {
          [data[j], data[j + 1]] = [data[j + 1], data[j]];
          steps.push({ type: 'swap', indices: [j, j + 1], array: [...data] });
        }
      }
    }

    steps.push({ type: 'done', array: [...data] });
    return { steps, complexity: 'O(n²)' };
  }

  // Quick Sort
  static quickSort(arr) {
    const steps = [];
    const data = [...arr];

    function partition(low, high) {
      const pivot = data[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({ type: 'compare', indices: [j, high], array: [...data] });
        
        if (data[j] < pivot) {
          i++;
          [data[i], data[j]] = [data[j], data[i]];
          steps.push({ type: 'swap', indices: [i, j], array: [...data] });
        }
      }

      [data[i + 1], data[high]] = [data[high], data[i + 1]];
      steps.push({ type: 'swap', indices: [i + 1, high], array: [...data] });
      return i + 1;
    }

    function sort(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    }

    sort(0, data.length - 1);
    steps.push({ type: 'done', array: [...data] });
    return { steps, complexity: 'O(n log n)' };
  }

  // Binary Search
  static binarySearch(arr, target) {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ type: 'check', index: mid, value: arr[mid], target });

      if (arr[mid] === target) {
        steps.push({ type: 'found', index: mid });
        return { steps, found: true, index: mid, complexity: 'O(log n)' };
      }

      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    steps.push({ type: 'not-found' });
    return { steps, found: false, complexity: 'O(log n)' };
  }

  // Linear Search
  static linearSearch(arr, target) {
    const steps = [];

    for (let i = 0; i < arr.length; i++) {
      steps.push({ type: 'check', index: i, value: arr[i], target });

      if (arr[i] === target) {
        steps.push({ type: 'found', index: i });
        return { steps, found: true, index: i, complexity: 'O(n)' };
      }
    }

    steps.push({ type: 'not-found' });
    return { steps, found: false, complexity: 'O(n)' };
  }

  // Stack operations
  static stackOperations(operations) {
    const steps = [];
    const stack = [];

    operations.forEach(op => {
      if (op.action === 'push') {
        stack.push(op.value);
        steps.push({ type: 'push', value: op.value, stack: [...stack] });
      } else if (op.action === 'pop') {
        const value = stack.pop();
        steps.push({ type: 'pop', value, stack: [...stack] });
      }
    });

    return { steps, complexity: 'O(1) per operation' };
  }

  // Queue operations
  static queueOperations(operations) {
    const steps = [];
    const queue = [];

    operations.forEach(op => {
      if (op.action === 'enqueue') {
        queue.push(op.value);
        steps.push({ type: 'enqueue', value: op.value, queue: [...queue] });
      } else if (op.action === 'dequeue') {
        const value = queue.shift();
        steps.push({ type: 'dequeue', value, queue: [...queue] });
      }
    });

    return { steps, complexity: 'O(1) per operation' };
  }
}
