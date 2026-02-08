import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../shared/firebase';
import { updatePassword, signOut } from 'firebase/auth';
import { useAuth } from '../shared/AuthContext';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
    const { refreshUser } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // 1. Update Password in Firebase
            await updatePassword(auth.currentUser, password);
            const token = await auth.currentUser.getIdToken();

            // 2. Clear Flag in Backend
            const response = await fetch('/api/auth/clear-reset-flag', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to synchronize security headers.');
            }

            // 3. Refresh token and user profile
            await refreshUser();

            setSuccess(true);
            setTimeout(() => {
                navigate('/seller/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Reset error:', err);
            if (err.code === 'auth/requires-recent-login') {
                setError('For security, please logout and login again to change password.');
            } else {
                setError(err.message || 'An error occurred during reset.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div className="reset-page">
            <style>{`
                :root {
                    --bg-page: #f8fafc;
                    --bg-card: #ffffff;
                    --border-subtle: #e5e7eb;
                    --text-primary: #0f172a;
                    --text-secondary: #475569;
                    --text-muted: #64748b;
                    --primary: #2563eb;
                    --primary-hover: #1d4ed8;
                    --danger: #dc2626;
                }

                .reset-page {
                    min-height: 100vh;
                    background: var(--bg-page);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }

                .logo-wrap {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 24px;
                }

                .logo-icon {
                    background: rgba(37, 99, 235, 0.1);
                    padding: 8px;
                    border-radius: 10px;
                    border: 1px solid rgba(37, 99, 235, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .logo-text {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                }

                .reset-card {
                    width: 100%;
                    max-width: 420px;
                    background: var(--bg-card);
                    border-radius: 14px;
                    padding: 32px;
                    border: 1px solid var(--border-subtle);
                    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
                }

                .card-header {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .icon-wrap {
                    font-size: 32px;
                    margin-bottom: 12px;
                }

                .card-header h1 {
                    color: var(--text-primary);
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                }

                .card-header p {
                    margin-top: 8px;
                    font-size: 14px;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                .input-group {
                    margin-top: 16px;
                }

                .input-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--text-primary);
                    margin-bottom: 6px;
                }

                .password-field {
                    position: relative;
                }

                .password-field input {
                    width: 100%;
                    padding: 10px 40px 10px 12px;
                    border-radius: 8px;
                    border: 1px solid var(--border-subtle);
                    font-size: 14px;
                    color: var(--text-primary);
                    background: #fff;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }

                .password-field input:focus {
                    outline: none;
                    border-color: var(--primary);
                }

                .eye-btn {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    color: var(--text-muted);
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .primary-btn {
                    margin-top: 24px;
                    width: 100%;
                    background: var(--primary);
                    color: #fff;
                    border: none;
                    padding: 12px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s, opacity 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .primary-btn:hover:not(:disabled) {
                    background: var(--primary-hover);
                }

                .primary-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .link-btn {
                    margin-top: 16px;
                    width: 100%;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 8px;
                    transition: color 0.2s;
                }

                .link-btn:hover {
                    color: var(--text-primary);
                }

                .note {
                    margin-top: 24px;
                    font-size: 12px;
                    color: var(--text-muted);
                    text-align: center;
                    line-height: 1.5;
                    max-width: 320px;
                }

                .alert {
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .alert-error {
                    background: #fef2f2;
                    border: 1px solid #fee2e2;
                    color: var(--danger);
                }

                .alert-success {
                    background: #f0fdf4;
                    border: 1px solid #dcfce7;
                    color: #15803d;
                }
            `}</style>

            <div className="logo-wrap">
                <div className="logo-icon">
                    <CheckCircle2 className="size-6 text-blue-600" />
                </div>
                <span className="logo-text">QPrint Security</span>
            </div>

            <div className="reset-card">
                <div className="card-header">
                    <div className="icon-wrap">🔐</div>
                    <h1>Secure Your Account</h1>
                    <p>
                        For security reasons, please set your own password before continuing.
                    </p>
                </div>

                <form onSubmit={handleReset}>
                    {error && (
                        <div className="alert alert-error">
                            <AlertCircle className="size-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <CheckCircle2 className="size-4" />
                            <span>Password secured! Redirecting...</span>
                        </div>
                    )}

                    <div className="input-group">
                        <label>New Password</label>
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading || success}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-btn"
                                tabIndex="-1"
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div className="password-field">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading || success}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="eye-btn"
                                tabIndex="-1"
                            >
                                {showConfirm ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading || success}
                    >
                        {loading && <Loader2 className="size-4 animate-spin" />}
                        Update & Secure Account
                    </button>
                </form>

                <button onClick={handleLogout} className="link-btn">
                    Cancel and Logout
                </button>
            </div>

            <p className="note">
                By setting a new password, your temporary credentials will be permanently invalidated.
            </p>
        </div>
    );
};

export default ResetPassword;
