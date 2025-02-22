import React, { useState } from 'react';

const CreateExpenditure = () => {
  const [expenditure, setExpenditure] = useState({
    title: '',
    amount: '',
    description: '',
    date: '',
    category: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement expenditure creation logic
    console.log('Expenditure data:', expenditure);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenditure(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Expenditure</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={expenditure.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={expenditure.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={expenditure.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={expenditure.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            name="category"
            value={expenditure.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="supplies">Supplies</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Expenditure
        </button>
      </form>
    </div>
  );
};

export default CreateExpenditure;