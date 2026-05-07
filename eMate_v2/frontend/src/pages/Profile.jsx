import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const fields = [
    { label: 'Full Name', value: user?.name, icon: '👤' },
    { label: 'Email', value: user?.email, icon: '📧' },
    { label: 'Contact Number', value: user?.contactNumber, icon: '📱' },
    { label: 'Address', value: user?.address, icon: '📍' },
    { label: 'Role', value: user?.role === 'admin' ? '👑 Admin' : '🛒 Customer', icon: '🔖' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 px-8 py-10 text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-md">
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-green-100 text-sm mt-1">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="mt-2 inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              👑 ADMIN
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Details</h2>
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">{field.icon}</span>
              <div>
                <p className="text-xs text-gray-500">{field.label}</p>
                <p className="font-medium text-gray-800">{field.value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
