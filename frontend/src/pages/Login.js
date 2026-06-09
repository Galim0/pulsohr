import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/sks.png';

const API = 'http://127.0.0.1:8000';

function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // phone / code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/send-otp`, { phone });
      setStep('code');
    } catch (e) {
      setError('Ошибка отправки кода');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, { phone, code });
      onLogin(res.data);
    } catch (e) {
      setError('Неверный код');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Логотип и заголовок */}
        <div style={styles.logoSection}>
          <img
            src={logo}
            alt="СКС Ломбард"
            style={styles.logo}
            onError={(e) => {
              // Если логотип не загрузился, показываем fallback
              e.target.style.display = 'none';
            }}
          />
          <h2 style={styles.title}>PulseHR</h2>
        </div>

        <p style={styles.subtitle}>Войдите по номеру телефона</p>

        {step === 'phone' ? (
          <>
            <input
              style={styles.input}
              placeholder="+7 000 000 00 00"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendOtp()}
            />
            <button
              style={styles.button}
              onClick={sendOtp}
              disabled={loading || phone.length < 10}
            >
              {loading ? 'Отправка...' : 'Получить код'}
            </button>
          </>
        ) : (
          <>
            <p style={styles.hint}>Код отправлен на {phone}</p>
            <input
              style={styles.input}
              placeholder="Введите код из SMS"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && verifyOtp()}
              maxLength={6}
            />
            <button
              style={styles.button}
              onClick={verifyOtp}
              disabled={loading || code.length < 4}
            >
              {loading ? 'Проверка...' : 'Войти'}
            </button>
            <button
              style={styles.link}
              onClick={() => {
                setStep('phone');
                setCode('');
                setError('');
              }}
            >
              ← Изменить номер
            </button>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footer}>
          Система опросов сотрудников СКС Ломбард
        </p>
      </div>
    </div>
  );
}


const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #E30613 0%, #C40010 50%, #8B0000 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '48px 42px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    animation: 'slideUp 0.4s ease-out',
  },
  logoSection: {
    marginBottom: '24px',
  },
  logo: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginBottom: '16px',
    display: 'block',
    margin: '0 auto 16px',
  },
  title: {
    fontSize: '36px',
    color: '#E30613',
    marginBottom: '8px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#666',
    marginBottom: '32px',
    fontSize: '16px',
  },
  hint: {
    color: '#555',
    marginBottom:
    '20px',
    fontSize: '14px',
    background: '#fff5f5',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ffe0e0',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #E30613, #C40010)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(227, 6, 19, 0.4)',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#E30613',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '8px',
    padding: '8px',
    transition: 'all 0.2s',
  },
  error: {
    color: '#E30613',
    fontSize: '14px',
    background: '#fff0f0',
    padding: '10px',
    borderRadius: '8px',
    marginTop: '16px',
    border: '1px solid #ffe0e0',
  },
  footer: {
    marginTop: '24px',
    fontSize: '12px',
    color: '#999',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '16px',
  },
};

// Добавляем CSS анимацию
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleElement);

export default Login;