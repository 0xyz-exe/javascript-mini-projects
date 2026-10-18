export class ExpenseManager {
  constructor() {
    this.transactions = [];
  }

  addTransaction(type, amount, category, description = '', date = null) {
    if (!['income', 'expense'].includes(type)) {
      throw new Error('Type must be income or expense');
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Amount must be positive number');
    }

    if (!category || !category.trim()) {
      throw new Error('Category is required');
    }

    const transaction = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      type,
      amount: numAmount,
      category: category.trim(),
      description: description.trim(),
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    this.transactions.push(transaction);
    return transaction;
  }

  deleteTransaction(id) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    this.transactions.splice(index, 1);
  }

  getTransactions() {
    return [...this.transactions];
  }

  filterByDateRange(startDate, endDate) {
    return this.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );
  }

  filterByCategory(category) {
    return this.transactions.filter(t => t.category === category);
  }

  getTotalIncome() {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses() {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getBalance() {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  getCategorySummary() {
    const summary = {};
    
    this.transactions.forEach(t => {
      if (!summary[t.category]) {
        summary[t.category] = { income: 0, expense: 0, count: 0 };
      }
      
      if (t.type === 'income') {
        summary[t.category].income += t.amount;
      } else {
        summary[t.category].expense += t.amount;
      }
      
      summary[t.category].count++;
    });

    return Object.entries(summary).map(([category, data]) => ({
      category,
      ...data,
      net: data.income - data.expense
    }));
  }

  getMonthlyTotals() {
    const monthly = {};
    
    this.transactions.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthly[month]) {
        monthly[month] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        monthly[month].income += t.amount;
      } else {
        monthly[month].expense += t.amount;
      }
    });

    return Object.entries(monthly)
      .map(([month, data]) => ({
        month,
        ...data,
        balance: data.income - data.expense
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }

  exportCSV() {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = this.transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount.toFixed(2),
      t.description
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  exportJSON() {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions: this.transactions
    }, null, 2);
  }

  importData(data) {
    if (!data || !data.transactions || !Array.isArray(data.transactions)) {
      throw new Error('Invalid import format');
    }

    const valid = data.transactions.filter(t =>
      t.id && t.type && t.amount && t.category && t.date
    );

    this.transactions = valid;
    return valid.length;
  }
}
