import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Survey from './Survey';
import CreateSurvey from './CreateSurvey';
import Analytics from './Analytics';

const API = 'http://127.0.0.1:8000';

function Dashboard({ user, onLogout }) {
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [creating, setCreating] = useState(false);
  const [activeAnalytics, setActiveAnalytics] = useState(null);

  useEffect(() => {
    axios.get(`${API}/surveys/`).then(res => setSurveys(res.data));
  }, []);

  if (activeAnalytics) return (
    <Analytics
      surveyId={activeAnalytics}
      onBack={() => setActiveAnalytics(null)}
    />
  );

  if (creating) return (
    <CreateSurvey onBack={() => setCreating(false)} />
  );

  if (activeSurvey) return (
    <Survey
      surveyId={activeSurvey}
      user={user}
      onBack={() => setActiveSurvey(null)}
    />
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>PulseHR</h1>
        <div style={styles.headerRight}>
          <span style={styles.phone}>{user.phone}</span>
          <button style={styles.logout} onClick={onLogout}>Выйти</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.topRow}>
          <h2 style={styles.sectionTitle}>Доступные опросы</h2>
          <button style={styles.createBtn} onClick={() => setCreating(true)}>
            + Создать опрос
          </button>
        </div>

        {surveys.length === 0 ? (
          <p style={styles.empty}>Опросов пока нет</p>
        ) : (
          surveys.map(survey => (
            <div key={survey.id} style={styles.card}>
              <h3 style={styles.surveyTitle}>{survey.title}</h3>
              <p style={styles.surveyDesc}>{survey.description}</p>
              <div style={styles.cardFooter}>
                <span style={{
                  ...styles.badge,
                  background: survey.status === 'active' ? '#dcfce7' : '#f3f4f6',
                  color: survey.status === 'active' ? '#16a34a' : '#6b7280',
                }}>
                  {survey.status === 'active' ? 'Активный' : 'Черновик'}
                </span>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button
                    style={styles.startBtn}
                    onClick={() => setActiveSurvey(survey.id)}
                  >
                    Пройти →
                  </button>
                  <button
                    style={styles.analyticsBtn}
                    onClick={() => setActiveAnalytics(survey.id)}
                  >
                    📊
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  title: { fontSize: '22px', color: '#4F46E5', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  phone: { color: '#555', fontSize: '14px' },
  logout: { background: 'none', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', color: '#555' },
  content: { maxWidth: '720px', margin: '32px auto', padding: '0 16px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '20px', color: '#333', margin: 0 },
  empty: { color: '#888', textAlign: 'center', padding: '40px' },
  card: { background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  surveyTitle: { fontSize: '17px', color: '#333', margin: '0 0 6px' },
  surveyDesc: { color: '#666', fontSize: '14px', margin: '0 0 14px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  startBtn: { background: '#4F46E5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  createBtn: { background: '#4F46E5', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  analyticsBtn: { background: 'white', color: '#4F46E5', border: '1px solid #4F46E5', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
};

export default Dashboard;