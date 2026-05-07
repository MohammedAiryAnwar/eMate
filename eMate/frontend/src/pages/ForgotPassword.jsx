import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: '', fatherName: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(form);
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-4xl mb-2">🔑</p>
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-1">Verify your identity to reset</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
            <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} required placeholder="Father's full name" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required placeholder="New password" className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Resetting...' : 'Reset Password 🔑'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Remembered it?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
