import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function CreateSurvey({ onBack }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [questions, setQuestions] = useState([
    { type: 'scale', text: '', options: [1,2,3,4,5] }
  ]);
  const [saved, setSaved] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'text', text: '', options: null }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    if (field === 'type' && value === 'scale') updated[index].options = [1,2,3,4,5];
    if (field === 'type' && value === 'text') updated[index].options = null;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      is_anonymous: isAnonymous,
      questions: questions.map((q, i) => ({
        type: q.type,
        text: q.text,
        order_num: String(i + 1),
        options: q.options,
      }))
    };
    await axios.post(`${API}/surveys/`, payload);
    setSaved(true);
  };

  if (saved) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.successIcon}>✓</h2>
        <h3>Опрос создан!</h3>
        <p style={styles.subtitle}>Теперь опубликуй его в списке опросов</p>
        <button style={styles.button} onClick={onBack}>На главную</button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <button style={styles.back} onClick={onBack}>← Назад</button>
        <h2 style={styles.title}>Новый опрос</h2>

        <div style={styles.card}>
          <label style={styles.label}>Название опроса</label>
          <input
            style={styles.input}
            placeholder="Например: Опрос вовлечённости Q2"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <label style={styles.label}>Описание</label>
          <textarea
            style={styles.textarea}
            placeholder="Краткое описание для сотрудников"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
            />
            <span style={styles.checkboxText}>Анонимный опрос</span>
          </label>
        </div>

        <h3 style={styles.sectionTitle}>Вопросы</h3>

        {questions.map((q, i) => (
          <div key={i} style={styles.questionCard}>
            <div style={styles.questionHeader}>
              <span style={styles.questionNum}>Вопрос {i + 1}</span>
              <button style={styles.removeBtn} onClick={() => removeQuestion(i)}>✕</button>
            </div>

            <label style={styles.label}>Тип вопроса</label>
            <select
              style={styles.select}
              value={q.type}
              onChange={e => updateQuestion(i, 'type', e.target.value)}
            >
              <option value="scale">Шкала (1-5)</option>
              <option value="text">Текстовый ответ</option>
              <option value="single">Один вариант</option>
              <option value="multiple">Несколько вариантов</option>
            </select>

            <label style={styles.label}>Текст вопроса</label>
            <input
              style={styles.input}
              placeholder="Введите вопрос..."
              value={q.text}
              onChange={e => updateQuestion(i, 'text', e.target.value)}
            />

            {(q.type === 'single' || q.type === 'multiple') && (
              <>
                <label style={styles.label}>Варианты ответов (через запятую)</label>
                <input
                  style={styles.input}
                  placeholder="Вариант 1, Вариант 2, Вариант 3"
                  value={(q.options || []).join(', ')}
                  onChange={e => updateQuestion(i, 'options', e.target.value.split(',').map(s => s.trim()))}
                />
              </>
            )}
          </div>
        ))}

        <button style={styles.addBtn} onClick={addQuestion}>
          + Добавить вопрос
        </button>

        <button style={styles.button} onClick={handleSubmit}>
          Сохранить опрос
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px 16px' },
  inner: { maxWidth: '680px', margin: '0 auto' },
  card: { background: 'white', borderRadius: '10px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  back: { background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '15px', marginBottom: '16px', padding: 0 },
  title: { fontSize: '24px', color: '#333', marginBottom: '16px' },
  sectionTitle: { fontSize: '18px', color: '#333', marginBottom: '12px' },
  label: { display: 'block', fontSize: '14px', color: '#555', marginBottom: '6px', marginTop: '12px' },
  input: { width: '100%', padding: '10px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' },
  select: { width: '100%', padding: '10px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', cursor: 'pointer' },
  checkboxText: { fontSize: '15px', color: '#333' },
  questionCard: { background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  questionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  questionNum: { fontSize: '15px', fontWeight: '500', color: '#4F46E5' },
  removeBtn: { background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px' },
  addBtn: { width: '100%', padding: '12px', fontSize: '15px', background: 'white', color: '#4F46E5', border: '2px dashed #4F46E5', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px' },
  button: { width: '100%', padding: '14px', fontSize: '16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' },
  successIcon: { fontSize: '48px', color: '#16a34a', margin: '0 0 8px' },
  subtitle: { color: '#666', marginBottom: '20px' },
};

export default CreateSurvey;