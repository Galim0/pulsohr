import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function CreateSurvey({ onBack }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [questions, setQuestions] = useState([
    { id: Date.now(), type: 'scale', text: '', options: [1,2,3,4,5,6,7,8,9,10], conditional_logic: null }
  ]);
  const [saved, setSaved] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(), type: 'text', text: '', options: null,
      conditional_logic: null
    }]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const updated = { ...q, [field]: value };
        if (field === 'type') {
          if (value === 'scale') updated.options = [1,2,3,4,5,6,7,8,9,10];
          else if (value === 'single' || value === 'multiple') updated.options = ['Вариант 1', 'Вариант 2'];
          else if (value === 'matrix') {
            updated.rows = ['Строка 1', 'Строка 2'];
            updated.columns = ['Колонка 1', 'Колонка 2', 'Колонка 3'];
          }
          else updated.options = null;
        }
        return updated;
      }
      return q;
    }));
  };

  const updateConditionalLogic = (questionId, logic) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, conditional_logic: logic } : q
    ));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async () => {
    const payload = {
      title, description, is_anonymous: isAnonymous,
      start_date: startDate || null,
      end_date: endDate || null,
      questions: questions.map((q, i) => ({
        type: q.type, text: q.text, order_num: String(i + 1),
        options: q.options, rows: q.rows, columns: q.columns,
        conditional_logic: q.conditional_logic,
      }))
    };
    await axios.post(`${API}/surveys/`, payload);
    setSaved(true);
  };

  if (saved) return (
    <div style={styles.container}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✓</div>
        <h3>Опрос создан!</h3>
        <p style={styles.subtitle}>Теперь опубликуйте его в списке опросов</p>
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
          <label style={styles.label}>Название опроса *</label>
          <input style={styles.input} placeholder="Например: Опрос вовлечённости Q2"
            value={title} onChange={e => setTitle(e.target.value)} />

          <label style={styles.label}>Описание</label>
          <textarea style={styles.textarea} placeholder="Краткое описание для сотрудников"
            value={description} onChange={e => setDescription(e.target.value)} />

          {/* 🔥 СРОКИ ПРОВЕДЕНИЯ */}
          <div style={styles.datesRow}>
            <div style={{flex: 1}}>
              <label style={styles.label}>Дата начала</label>
              <input type="date" style={styles.input} value={startDate}
                onChange={e => setStartDate(e.target.value)} />
            </div>
            <div style={{flex: 1}}>
              <label style={styles.label}>Дата окончания</label>
              <input type="date" style={styles.input} value={endDate}
                onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>


          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)} />
            <span style={styles.checkboxText}>🔒 Анонимный опрос</span>
          </label>
        </div>

        <h3 style={styles.sectionTitle}>Вопросы ({questions.length})</h3>

        {questions.map((q, index) => (
          <div key={q.id} style={styles.questionCard}>
            <div style={styles.questionHeader}>
              <span style={styles.questionNum}>Вопрос {index + 1}</span>
              <button style={styles.removeBtn} onClick={() => removeQuestion(q.id)}
                disabled={questions.length === 1}>✕</button>
            </div>

            <label style={styles.label}>Тип вопроса</label>
            <select style={styles.select} value={q.type}
              onChange={e => updateQuestion(q.id, 'type', e.target.value)}>
              <option value="text">Текстовый ответ</option>
              <option value="single">Одиночный выбор</option>
              <option value="multiple">Множественный выбор</option>
              <option value="scale">Шкала NPS (1-10)</option>
              <option value="matrix">Матрица</option>
            </select>

            <label style={styles.label}>Текст вопроса *</label>
            <input style={styles.input} placeholder="Введите вопрос..."
              value={q.text} onChange={e => updateQuestion(q.id, 'text', e.target.value)} />

            {(q.type === 'single' || q.type === 'multiple') && (
              <div>
                <label style={styles.label}>Варианты ответов (через запятую)</label>
                <input style={styles.input} placeholder="Вариант 1, Вариант 2, Вариант 3"
                  value={(q.options || []).join(', ')}
                  onChange={e => updateQuestion(q.id, 'options', e.target.value.split(',').map(s => s.trim()))} />
              </div>
            )}

            {q.type === 'matrix' && (
              <>
                <label style={styles.label}>Строки (через запятую)</label>
                <input style={styles.input} placeholder="Строка 1, Строка 2"
                  value={(q.rows || []).join(', ')}
                  onChange={e => updateQuestion(q.id, 'rows', e.target.value.split(',').map(s => s.trim()))} />
                <label style={styles.label}>Колонки (через запятую)</label>
                <input style={styles.input} placeholder="Колонка 1, Колонка 2"
                  value={(q.columns || []).join(', ')}
                  onChange={e => updateQuestion(q.id, 'columns', e.target.value.split(',').map(s => s.trim()))} />
              </>
            )}

            {/* 🔥 ВЕТВЛЕНИЕ */}
            <div style={styles.logicSection}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={!!q.conditional_logic}
                  onChange={e => {
                    if (e.target.checked) {
                      updateConditionalLogic(q.id, {
                        depends_on: questions[0]?.id,
                        condition: 'equals', value: ''
                      });
                    } else {
                      updateConditionalLogic(q.id, null);
                    }
                  }} />
                <span style={styles.checkboxText}>🔀 Условное отображение (ветвление)</span>
              </label>


              {q.conditional_logic && (
                <div style={styles.logicBuilder}>
                  <p style={styles.hint}>Показать этот вопрос, если:</p>
                  <select style={styles.select} value={q.conditional_logic.depends_on}
                    onChange={e => updateConditionalLogic(q.id, {
                      ...q.conditional_logic, depends_on: e.target.value
                    })}>
                    {questions.filter(prev => prev.id !== q.id).map(prev => (
                      <option key={prev.id} value={prev.id}>
                        {prev.text || `Вопрос ${questions.indexOf(prev) + 1}`}
                      </option>
                    ))}
                  </select>
                  <select style={styles.select} value={q.conditional_logic.condition}
                    onChange={e => updateConditionalLogic(q.id, {
                      ...q.conditional_logic, condition: e.target.value
                    })}>
                    <option value="equals">равно</option>
                    <option value="not_equals">не равно</option>
                    <option value="greater_than">больше</option>
                    <option value="less_than">меньше</option>
                  </select>
                  <input style={styles.input} placeholder="Значение"
                    value={q.conditional_logic.value}
                    onChange={e => updateConditionalLogic(q.id, {
                      ...q.conditional_logic, value: e.target.value
                    })} />
                </div>
              )}
            </div>
          </div>
        ))}

        <button style={styles.addBtn} onClick={addQuestion}>+ Добавить вопрос</button>
        <button style={styles.button} onClick={handleSubmit}
          disabled={!title || questions.some(q => !q.text)}>
          Сохранить опрос
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f7f7f7', padding: '24px 16px' },
  inner: { maxWidth: '680px', margin: '0 auto' },
  card: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  back: { background: 'none', border: 'none', color: '#E30613', cursor: 'pointer', fontSize: '15px', marginBottom: '16px', padding: 0 },
  title: { fontSize: '24px', color: '#333', marginBottom: '16px' },
  sectionTitle: { fontSize: '18px', color: '#333', marginBottom: '12px', fontWeight: '600' },
  label: { display: 'block', fontSize: '14px', color: '#555', marginBottom: '6px', marginTop: '12px', fontWeight: '500' },
  input: { width: '100%', padding: '10px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' },
  select: { width: '100%', padding: '10px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  datesRow: { display: 'flex', gap: '12px', marginTop: '12px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', cursor: 'pointer' },
  checkboxText: { fontSize: '15px', color: '#333' },
  questionCard: { background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderLeft: '5px solid #E30613' },
  questionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  questionNum: { fontSize: '15px', fontWeight: '600', color: '#E30613' },
  removeBtn: { background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '18px' },
  logicSection: { marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #f0f0f0' },
  logicBuilder: { marginTop: '12px', padding: '16px', background: '#fff5f5', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' },
  hint: { color: '#666', fontSize: '13px', margin: 0 },

  addBtn: { width: '100%', padding: '14px', fontSize: '15px', background: 'white', color: '#E30613', border: '2px dashed #E30613', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px', fontWeight: '600' },
  button: { width: '100%', padding: '14px', fontSize: '16px', background: 'linear-gradient(135deg, #E30613, #C40010)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px', fontWeight: '600' },
  successCard: { background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '80px auto' },
  successIcon: { fontSize: '64px', color: '#16a34a', marginBottom: '16px' },
  subtitle: { color: '#666', marginBottom: '20px' },
};

export default CreateSurvey;
