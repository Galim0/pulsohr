import React, { useState } from 'react';
import axios from 'axios';

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
        <h2 style={styles.title}>PulseHR</h2>
        <p style={styles.subtitle}>Войдите по номеру телефона</p>

        {step === 'phone' ? (
          <>
            <input
              style={styles.input}
              placeholder="+7 000 000 00 00"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button style={styles.button} onClick={sendOtp} disabled={loading}>
              {loading ? 'Отправка...' : 'Получить код'}
            </button>
          </>
        ) : (
          <>
            <p style={styles.hint}>Код отправлен на {phone}</p>
            <input
              style={styles.input}
              placeholder="Введите код"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <button style={styles.button} onClick={verifyOtp} disabled={loading}>
              {loading ? 'Проверка...' : 'Войти'}
            </button>
            <button style={styles.link} onClick={() => setStep('phone')}>
              Изменить номер
            </button>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    width: '360px',
    textAlign: 'center',
  },
  title: { fontSize: '28px', color: '#333', marginBottom: '8px' },
  subtitle: { color: '#888', marginBottom: '24px' },
  hint: { color: '#555', marginBottom: '12px', fontSize: '14px' },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: { color: 'red', fontSize: '14px' },
};

export default Login;