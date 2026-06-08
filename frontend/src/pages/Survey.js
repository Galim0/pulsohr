import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function Survey({ surveyId, user, onBack }) {
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`${API}/surveys/${surveyId}`).then(res => setSurvey(res.data));
  }, [surveyId]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      survey_id: surveyId,
      user_id: user.id,
      answers: Object.entries(answers).map(([question_id, value]) => ({
        question_id,
        text_answer: typeof value === 'string' ? value : null,
        numeric_value: typeof value === 'number' ? value : null,
        selected_options: Array.isArray(value) ? value : null,
      }))
    };
    await axios.post(`${API}/responses/`, payload);
    setSubmitted(true);
  };

  if (!survey) return <p style={styles.loading}>Загрузка...</p>;

  if (submitted) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.successIcon}>✓</h2>
        <h3>Спасибо за ответы!</h3>
        <p style={styles.subtitle}>Ваши ответы записаны</p>
        <button style={styles.button} onClick={onBack}>На главную</button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <button style={styles.back} onClick={onBack}>← Назад</button>
        <h2 style={styles.title}>{survey.title}</h2>
        {survey.description && <p style={styles.subtitle}>{survey.description}</p>}
        {survey.is_anonymous && (
          <div style={styles.anonBadge}>🔒 Этот опрос анонимный</div>
        )}

        {survey.questions.map((q, i) => (
          <div key={q.id} style={styles.questionCard}>
            <p style={styles.questionText}>{i + 1}. {q.text}</p>

            {q.type === 'text' && (
              <textarea
                style={styles.textarea}
                placeholder="Ваш ответ..."
                value={answers[q.id] || ''}
                onChange={e => handleAnswer(q.id, e.target.value)}
              />
            )}

            {q.type === 'scale' && (
              <div style={styles.scaleRow}>
                {(q.options || [1,2,3,4,5]).map(val => (
                  <button
                    key={val}
                    style={{
                      ...styles.scaleBtn,
                      background: answers[q.id] === val ? '#4F46E5' : 'white',
                      color: answers[q.id] === val ? 'white' : '#333',
                    }}
                    onClick={() => handleAnswer(q.id, val)}
                  >
                    {val}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'single' && (
              <div>
                {(q.options || []).map(opt => (
                  <label key={opt} style={styles.optionLabel}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleAnswer(q.id, opt)}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'multiple' && (
              <div>
                {(q.options || []).map(opt => (
                  <label key={opt} style={styles.optionLabel}>
                    <input
                      type="checkbox"
                      checked={(answers[q.id] || []).includes(opt)}
                      onChange={e => {
                        const cur = answers[q.id] || [];
                        handleAnswer(q.id, e.target.checked
                          ? [...cur, opt]
                          : cur.filter(x => x !== opt));
                      }}
                    />
                    <span style={styles.optionText}>{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button style={styles.button} onClick={handleSubmit}>
          Отправить ответы
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px 16px' },
  inner: { maxWidth: '680px', margin: '0 auto' },
  card: { background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '80px auto' },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  back: { background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '15px', marginBottom: '16px', padding: 0 },
  title: { fontSize: '24px', color: '#333', marginBottom: '8px' },
  subtitle: { color: '#666', marginBottom: '16px' },
  anonBadge: { background: '#f0fdf4', color: '#16a34a', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', display: 'inline-block' },
  questionCard: { background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '16px' },
  questionText: { fontSize: '16px', color: '#333', marginBottom: '14px', fontWeight: '500' },
  textarea: { width: '100%', padding: '10px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '100px', boxSizing: 'border-box', resize: 'vertical' },
  scaleRow: { display: 'flex', gap: '10px' },
  scaleBtn: { width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', cursor: 'pointer' },
  optionLabel: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' },
  optionText: { fontSize: '15px', color: '#333' },
  button: { width: '100%', padding: '14px', fontSize: '16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' },
  successIcon: { fontSize: '48px', color: '#16a34a' },
};

export default Survey;