'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const CATEGORIES = ['Food', 'Rent', 'Utilities', 'Entertainment'];

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [newExpense, setNewExpense] = useState<Expense>({
    id: '',
    category: 'Food',
    amount: 0,
    date: new Date(),
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Calculate total expenses
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotal(totalExpenses);

    // Calculate monthly data for line chart
    const data = expenses.reduce((acc: { [key: string]: number }, { amount, date }) => {
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = amount;
      } else {
        acc[month] += amount;
      }
      return acc;
    }, {});

    const formattedData = Object.keys(data).map((key) => ({
      name: key,
      Spending: data[key],
    }));
    setMonthlyData(formattedData);
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setExpenses((prev) => [...prev, { ...newExpense, id: uuidv4() }]);
  };

  const dataPie = CATEGORIES.map((category) => ({
    name: category,
    value: expenses
      .filter((expense) => expense.category === category)
      .reduce((acc, curr) => acc + curr.amount, 0),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-500 p-10">
      <div className="text-white text-xl font-bold mb-5">Total Expenses: ${total}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-2">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={dataPie}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-2">Monthly Spending Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Spending" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mt-4">
        <h2 className="font-semibold text-gray-700 mb-4">Add New Expense</h2>
        <form className="flex flex-col gap-4" onSubmit={handleAddExpense}>
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="border rounded p-2"
          >
            {CATEGORIES.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={newExpense.amount}
            placeholder="Amount"
            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
            className="border rounded p-2"
          />
          <DatePicker
            selected={newExpense.date}
            onChange={(date: Date) => setNewExpense({ ...newExpense, date })}
            className="border rounded p-2"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}