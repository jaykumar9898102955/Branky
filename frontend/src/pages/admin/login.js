import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../css/AdminLogin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('branky_token', data.token);
        localStorage.setItem('branky_user', JSON.stringify(data.user));
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Admin Login — Branky S.T.E.M. Labs</title></Head>
      <div className={styles.page}>
        <div className={styles.left}>
          <div className={styles.leftContent}>
            <img src="/logo.png" alt="Branky" className={styles.logo} style={{filter:'brightness(0) invert(1)'}} />
            <h1>Admin Portal</h1>
            <p>Manage registrations, track student data, and monitor camp performance — all in one place.</p>
            <div className={styles.features}>
              <div className={styles.feat}><span>📋</span> Registration Management</div>
              <div className={styles.feat}><span>📊</span> Analytics Dashboard</div>
              <div className={styles.feat}><span>🔍</span> Search & Filter</div>
              <div className={styles.feat}><span>✅</span> Status Updates</div>
            </div>
          </div>
          <div className={styles.blob1}/><div className={styles.blob2}/>
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🔐</div>
            <h2>Welcome Back</h2>
            <p className={styles.cardSub}>Sign in to your admin account</p>

            <form onSubmit={submit} className={styles.form}>
              <div className={styles.fg}>
                <label>Username</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>👤</span>
                  <input name="username" value={form.username} onChange={ch} placeholder="Enter username" required autoComplete="username" />
                </div>
              </div>
              <div className={styles.fg}>
                <label>Password</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>🔑</span>
                  <input type={show ? 'text' : 'password'} name="password" value={form.password} onChange={ch} placeholder="Enter password" required autoComplete="current-password" />
                  <button type="button" className={styles.showPwd} onClick={() => setShow(!show)}>{show ? '🙈' : '👁️'}</button>
                </div>
              </div>

              {error && <div className={styles.error}>⚠️ {error}</div>}

              <button type="submit" className={styles.loginBtn} disabled={loading}>
                {loading ? <span className={styles.spin}>⟳</span> : null}
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <div className={styles.hint}>
              <strong>Demo Credentials:</strong>
              <div className={styles.hintRow} onClick={() => setForm({username:'admin',password:'admin@123'})}>
                <span>Super Admin</span><code>admin / admin@123</code>
              </div>
              <div className={styles.hintRow} onClick={() => setForm({username:'manager',password:'branky@2025'})}>
                <span>Manager</span><code>manager / branky@2025</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
