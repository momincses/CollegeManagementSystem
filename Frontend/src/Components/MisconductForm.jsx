import React, { useState, useEffect } from 'react';

const MisconductForm = ({ misconductId, onClose, onMisconductUpdated }) => {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examType, setExamType] = useState('');
  const [misconductReason, setMisconductReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    if (misconductId) {
      // Fetch existing misconduct details for editing
      fetch(`/api/misconduct/${misconductId}`)
        .then(response => response.json())
        .then(data => {
          const { studentId, studentName, examDate, examType, reason, additionalNotes } = data.misconduct;
          setStudentId(studentId);
          setStudentName(studentName);
          setExamDate(examDate);
          setExamType(examType);
          setMisconductReason(reason);
          setAdditionalNotes(additionalNotes);
        })
        .catch(error => console.error("Error fetching misconduct details:", error));
    }
  }, [misconductId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const misconductData = { studentId, studentName, examDate, examType, reason: misconductReason, additionalNotes };

    const requestOptions = {
      method: misconductId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(misconductData),
    };

    fetch(`/api/misconduct/${misconductId ? misconductId : 'report'}`, requestOptions)
      .then(response => response.json())
      .then(() => {
        onMisconductUpdated();
        onClose();
      })
      .catch(error => console.error("Error saving misconduct:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{misconductId ? 'Edit Misconduct' : 'Report Misconduct'}</h2>
      <label>
        Student ID:
        <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
      </label>
      <label>
        Student Name:
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
      </label>
      <label>
        Exam Date:
        <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required />
      </label>
      <label>
        Exam Type:
        <select value={examType} onChange={(e) => setExamType(e.target.value)} required>
          <option value="">Select Type</option>
          <option value="Mid Semester">Mid Semester</option>
          <option value="End Semester">End Semester</option>
          <option value="Quiz">Quiz</option>
          <option value="Assignment">Assignment</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        Misconduct Reason:
        <textarea value={misconductReason} onChange={(e) => setMisconductReason(e.target.value)} required />
      </label>
      <label>
        Additional Notes:
        <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
      </label>
      <button type="submit">{misconductId ? 'Update' : 'Report'} Misconduct</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default MisconductForm; 