import { ExpenseManager } from './ExpenseManager.js';

class ExpenseApp {
  constructor() {
    this.manager = new ExpenseManager();
    
    this.elements = {
      typeSelect: document.getElementById('typeSelect'),
      amountInput: document.getElementById('amountInput'),
      categoryInput: document.getElementById('categoryInput'),
      descInput: document.getElementById('descInput'),
      dateInput: document.getElementById('dateInput'),
      addBtn: document.getElementById('addBtn'),
      
      totalIncome: document.getElementById('totalIncome'),
      totalExpense: document.getElementById('totalExpense'),
      balance: document.getElementById('balance'),
      
      transactionsList: document.getElementById('transactionsList'),
      categorySummary: document.getElementById('categorySummary'),
      
      exportCSVBtn: document.getElementById('exportCSV'),
      exportJSONBtn: document.getElementById('exportJSON'),
      importBtn: document.getElementById('importBtn'),
      importFile: document.getElementById('importFile')
    };

    this.elements.dateInput.value = new Date().toISOString().split('T')[0];
    
    this.loadFromStorage();
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    this.elements.addBtn.addEventListener('click', () => this.addTransaction());
    this.elements.exportCSVBtn.addEventListener('click', () => this.exportCSV());
    this.elements.exportJSONBtn.addEventListener('click', () => this.exportJSON());
    this.elements.importBtn.addEventListener('click', () => this.elements.importFile.click());
    this.elements.importFile.addEventListener('change', (e) => this.importData(e));
  }

  addTransaction() {
    const type = this.elements.typeSelect.value;
    const amount = this.elements.amountInput.value;
    const category = this.elements.categoryInput.value;
    const description = this.elements.descInput.value;
    const date = this.elements.dateInput.value;

    try {
      this.manager.addTransaction(type, amount, category, description, date);
      
      this.elements.amountInput.value = '';
      this.elements.categoryInput.value = '';
      this.elements.descInput.value = '';
      
      this.saveAndRender();
    } catch (err) {
      alert(err.message);
    }
  }

  deleteTransaction(id) {
    if (confirm('Delete this transaction?')) {
      this.manager.deleteTransaction(id);
      this.saveAndRender();
    }
  }

  saveAndRender() {
    this.saveToStorage();
    this.render();
  }

  render() {
    this.renderSummary();
    this.renderTransactions();
    this.renderCategories();
  }

  renderSummary() {
    const income = this.manager.getTotalIncome();
    const expense = this.manager.getTotalExpenses();
    const balance = this.manager.getBalance();

    this.elements.totalIncome.textContent = this.formatCurrency(income);
    this.elements.totalExpense.textContent = this.formatCurrency(expense);
    this.elements.balance.textContent = this.formatCurrency(balance);
    this.elements.balance.className = balance >= 0 ? 'positive' : 'negative';
  }

  renderTransactions() {
    const transactions = this.manager.getTransactions()
      .sort((a, b) => b.date.localeCompare(a.date));

    if (transactions.length === 0) {
      this.elements.transactionsList.innerHTML = '<p class="empty">No transactions yet</p>';
      return;
    }

    this.elements.transactionsList.innerHTML = transactions.map(t => `
      <div class="transaction-item ${t.type}">
        <div class="transaction-main">
          <div class="transaction-info">
            <span class="category">${this.escapeHtml(t.category)}</span>
            ${t.description ? `<span class="desc">${this.escapeHtml(t.description)}</span>` : ''}
          </div>
          <div class="transaction-amount ${t.type}">
            ${t.type === 'income' ? '+' : '-'}${this.formatCurrency(t.amount)}
          </div>
        </div>
        <div class="transaction-meta">
          <span class="date">${t.date}</span>
          <button class="delete-btn" data-id="${t.id}">Delete</button>
        </div>
      </div>
    `).join('');

    // Attach delete handlers
    this.elements.transactionsList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => this.deleteTransaction(btn.dataset.id));
    });
  }

  renderCategories() {
    const summary = this.manager.getCategorySummary()
      .sort((a, b) => (b.income + b.expense) - (a.income + a.expense));

    if (summary.length === 0) {
      this.elements.categorySummary.innerHTML = '<p class="empty">No categories yet</p>';
      return;
    }

    this.elements.categorySummary.innerHTML = summary.map(s => `
      <div class="category-item">
        <div class="category-name">${this.escapeHtml(s.category)}</div>
        <div class="category-stats">
          ${s.income > 0 ? `<span class="income">+${this.formatCurrency(s.income)}</span>` : ''}
          ${s.expense > 0 ? `<span class="expense">-${this.formatCurrency(s.expense)}</span>` : ''}
          <span class="count">${s.count} transactions</span>
        </div>
      </div>
    `).join('');
  }

  exportCSV() {
    const csv = this.manager.exportCSV();
    this.downloadFile(csv, `expenses-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  }

  exportJSON() {
    const json = this.manager.exportJSON();
    this.downloadFile(json, `expenses-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  }

  async importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const count = this.manager.importData(data);
      alert(`Imported ${count} transactions`);
      this.saveAndRender();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
    event.target.value = '';
  }

  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  saveToStorage() {
    try {
      const data = this.manager.exportJSON();
      localStorage.setItem('expenseTrackerData', data);
    } catch (err) {
      console.warn('Storage save failed:', err);
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('expenseTrackerData');
      if (data) {
        const parsed = JSON.parse(data);
        this.manager.importData(parsed);
      }
    } catch (err) {
      console.warn('Storage load failed:', err);
    }
  }

  formatCurrency(amount) {
    return amount.toFixed(2);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

new ExpenseApp();
