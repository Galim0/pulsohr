import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function Analytics({ surveyId, surveyTitle, onBack }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API}/analytics/${surveyId}`).then(res => setData(res.data));
  }, [surveyId]);

  if (!data) return <p style={styles.loading}>Загрузка...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <button style={styles.back} onClick={onBack}>← Назад</button>
        <h2 style={styles.title}>Аналитика: {data.survey_title}</h2>

        <div style={styles.statCard}>
          <div style={styles.statNum}>{data.total_responses}</div>
          <div style={styles.statLabel}>Прошли опрос</div>
        </div>

        {data.questions.map((q, i) => (
          <div key={i} style={styles.card}>
            <p style={styles.questionText}>{i + 1}. {q.question}</p>
            <p style={styles.answersCount}>Ответов: {q.total_answers}</p>

            {q.type === 'scale' && (
              <>
                <p style={styles.average}>Средняя оценка: <strong>{q.average}</strong></p>
                <div style={styles.barChart}>
                  {Object.entries(q.distribution).map(([val, count]) => (
                    <div key={val} style={styles.barRow}>
                      <span style={styles.barLabel}>{val}</span>
                      <div style={styles.barBg}>
                        <div style={{
                          ...styles.barFill,
                          width: q.total_answers > 0
                            ? `${(count / q.total_answers) * 100}%`
                            : '0%'
                        }}/>
                      </div>
                      <span style={styles.barCount}>{count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {q.type === 'text' && (
              <div>
                {(q.answers || []).map((text, j) => (
                  <div key={j} style={styles.textAnswer}>"{text}"</div>
                ))}
                {q.total_answers === 0 && <p style={styles.noAnswers}>Ответов пока нет</p>}
              </div>
            )}

            {(q.type === 'single' || q.type === 'multiple') && (
              <div style={styles.barChart}>
                {Object.entries(q.distribution || {}).map(([opt, count]) => (
                  <div key={opt} style={styles.barRow}>
                    <span style={styles.barLabel}>{opt}</span>
                    <div style={styles.barBg}>
                      <div style={{
                        ...styles.barFill,
                        width: q.total_answers > 0
                          ? `${(count / q.total_answers) * 100}%`
                          : '0%'
                      }}/>
                    </div>
                    <span style={styles.barCount}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px 16px' },
  inner: { maxWidth: '680px', margin: '0 auto' },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  back: { background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '15px', marginBottom: '16px', padding: 0 },
  title: { fontSize: '22px', color: '#333', marginBottom: '20px' },
  statCard: { background: '#4F46E5', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '20px' },
  statNum: { fontSize: '48px', color: 'white', fontWeight: 'bold' },
  statLabel: { fontSize: '16px', color: 'rgba(255,255,255,0.8)' },
  card: { background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  questionText: { fontSize: '16px', color: '#333', fontWeight: '500', marginBottom: '8px' },
  answersCount: { fontSize: '13px', color: '#888', marginBottom: '12px' },
  average: { fontSize: '15px', color: '#555', marginBottom: '12px' },
  barChart: { display: 'flex', flexDirection: 'column', gap: '8px' },
  barRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  barLabel: { width: '80px', fontSize: '13px', color: '#555', flexShrink: 0 },
  barBg: { flex: 1, background: '#f3f4f6', borderRadius: '4px', height: '20px' },
  barFill: { height: '100%', background: '#4F46E5', borderRadius: '4px', transition: 'width 0.5s' },
  barCount: { width: '30px', fontSize: '13px', color: '#555', textAlign: 'right' },
  textAnswer: { background: '#f9fafb', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', fontSize: '14px', color: '#444', fontStyle: 'italic' },
  noAnswers: { color: '#aaa', fontSize: '14px' },
};

export default Analytics;