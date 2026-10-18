import { test } from 'node:test';
import assert from 'node:assert';
import { ExpenseManager } from '../src/ExpenseManager.js';

test('add transaction', () => {
  const em = new ExpenseManager();
  const t = em.addTransaction('expense', 50, 'Food', 'Lunch');
  
  assert.ok(t.id);
  assert.strictEqual(t.type, 'expense');
  assert.strictEqual(t.amount, 50);
  assert.strictEqual(t.category, 'Food');
});

test('validate transaction type', () => {
  const em = new ExpenseManager();
  assert.throws(() => em.addTransaction('invalid', 50, 'Food'), /Type must be/);
});

test('validate amount', () => {
  const em = new ExpenseManager();
  assert.throws(() => em.addTransaction('expense', -50, 'Food'), /positive/);
  assert.throws(() => em.addTransaction('expense', 'abc', 'Food'), /positive/);
  assert.throws(() => em.addTransaction('expense', 0, 'Food'), /positive/);
});

test('validate category', () => {
  const em = new ExpenseManager();
  assert.throws(() => em.addTransaction('expense', 50, ''), /required/);
  assert.throws(() => em.addTransaction('expense', 50, '   '), /required/);
});

test('delete transaction', () => {
  const em = new ExpenseManager();
  const t = em.addTransaction('expense', 50, 'Food');
  
  assert.strictEqual(em.getTransactions().length, 1);
  em.deleteTransaction(t.id);
  assert.strictEqual(em.getTransactions().length, 0);
});

test('calculate totals', () => {
  const em = new ExpenseManager();
  em.addTransaction('income', 1000, 'Salary');
  em.addTransaction('expense', 200, 'Food');
  em.addTransaction('expense', 300, 'Rent');
  
  assert.strictEqual(em.getTotalIncome(), 1000);
  assert.strictEqual(em.getTotalExpenses(), 500);
  assert.strictEqual(em.getBalance(), 500);
});

test('category summary', () => {
  const em = new ExpenseManager();
  em.addTransaction('expense', 100, 'Food');
  em.addTransaction('expense', 50, 'Food');
  em.addTransaction('income', 200, 'Work');
  
  const summary = em.getCategorySummary();
  
  assert.strictEqual(summary.length, 2);
  
  const food = summary.find(s => s.category === 'Food');
  assert.strictEqual(food.expense, 150);
  assert.strictEqual(food.count, 2);
});

test('export CSV', () => {
  const em = new ExpenseManager();
  em.addTransaction('expense', 50, 'Food', 'Lunch', '2024-01-01');
  
  const csv = em.exportCSV();
  
  assert.ok(csv.includes('Date'));
  assert.ok(csv.includes('Food'));
  assert.ok(csv.includes('50.00'));
});

test('export and import JSON', () => {
  const em = new ExpenseManager();
  em.addTransaction('expense', 50, 'Food');
  em.addTransaction('income', 1000, 'Salary');
  
  const json = em.exportJSON();
  const data = JSON.parse(json);
  
  const em2 = new ExpenseManager();
  const count = em2.importData(data);
  
  assert.strictEqual(count, 2);
  assert.strictEqual(em2.getTransactions().length, 2);
});
