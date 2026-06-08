import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Survey from './Survey';
import CreateSurvey from './CreateSurvey';
import Analytics from './Analytics';
import logo from './assets/sks.png'; // ← Импортируем логотип

const API = 'http://127.0.0.1:8000';

function Dashboard({ user, onLogout }) {
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [creating, setCreating] = useState(false);
  const [activeAnalytics, setActiveAnalytics] = useState(null);

  const loadSurveys = () => {
    axios.get(`${API}/surveys/`).then(res => setSurveys(res.data));
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const publishSurvey = async (surveyId) => {
    await axios.patch(`${API}/surveys/${surveyId}/publish`);
    loadSurveys();
  };

  // Если открыта аналитика
  if (activeAnalytics) return (
    <Analytics
      surveyId={activeAnalytics}
      onBack={() => setActiveAnalytics(null)}
    />
  );

  // Если создаётся опрос
  if (creating) return (
    <CreateSurvey onBack={() => { setCreating(false); loadSurveys(); }} />
  );

  // Если проходится опрос
  if (activeSurvey) return (
    <Survey
      surveyId={activeSurvey}
      user={user}
      onBack={() => setActiveSurvey(null)}
    />
  );

  // Главный экран Dashboard
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <img src={logo} alt="СКС" style={styles.logo} />
          <h1 style={styles.title}>PulseHR</h1>
        </div>
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
                  {survey.status === 'draft' && (
                    <button
                      style={styles.publishBtn}
                      onClick={() => publishSurvey(survey.id)}
                    >
                      Опубликовать
                    </button>
                  )}
                  <button
                    style={styles.startBtn}
                    onClick={() => setActiveSurvey(survey.id)}
                  >
                    Пройти →
                  </button>
                  <button
                    style={styles.analyticsBtn}
                    onClick={() => setActiveAnalytics(survey.id)}
                    title="Аналитика"
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
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
  },
  header: {
    background: '#E30613',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(227, 6, 19, 0.3)',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
  },
  title: {
    fontSize: '28px',
    color: 'white',
    margin: 0,
    fontWeight: '700',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  phone: {
    color: 'white',
    fontSize: '15px',
  },
  logout: {
    background: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#E30613',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  content: {
    maxWidth: '720px',
    margin: '32px auto',
    padding: '0 16px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#333',
    margin: 0,
    fontWeight: '600',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    padding: '40px',
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  surveyTitle: {
    fontSize: '17px',
    color: '#333',
    margin: '0 0 6px',
    fontWeight: '600',
  },
  surveyDesc: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 14px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  publishBtn: {
    background: '#16a34a',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  startBtn: {
    background: '#E30613',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  createBtn: {
    background: '#E30613',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(227, 6, 19, 0.3)',
    transition: 'all 0.2s',
  },
  analyticsBtn: {
    background: 'white',
    color: '#E30613',
    border: '1px solid #E30613',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s',
  },
};

export default Dashboard;
