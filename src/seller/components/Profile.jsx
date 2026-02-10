import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Clock, Mail, Shield, Edit2, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../shared/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        shopName: '',
        address: '',
        contactNumber: '',
        email: '',
        workingHours: '9:00 AM - 9:00 PM',
        shopId: '',
        verificationStatus: 'verified',
        memberSince: '',
    });

    useEffect(() => {
        const fetchShopProfile = async () => {
            try {
                const response = await fetch('/api/auth/my-shop', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfile({
                        shopName: data.name,
                        address: data.location || 'No address provided',
                        contactNumber: data.phone || 'No phone provided',
                        email: data.email,
                        workingHours: '9:00 AM - 9:00 PM', // Fallback as this isn't in DB yet
                        shopId: `SHP_${data.id.toString().padStart(4, '0')}`,
                        verificationStatus: data.verification_status.toLowerCase(),
                        memberSince: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    });
                }
            } catch (error) {
                console.error("Error fetching shop profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchShopProfile();
        }
    }, [user]);

    const handleSave = () => {
        setIsEditing(false);
        // In real app, save to backend
    };

    if (loading) {
        return (
            <div className="size-full flex items-center justify-center bg-gray-50">
                <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="size-full bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Profile</h1>
                    <p className="text-gray-600">Identity & trust information</p>
                </div>

                {/* Verification Badge */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Shield className="size-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-900 mb-1">Verified Shop</h3>
                            <p className="text-sm text-green-700">
                                Your shop has been verified and is trusted by the platform
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-4 rounded-xl">
                                <Store className="size-8 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{profile.shopName}</h2>
                                <p className="text-sm text-gray-500">Member since {profile.memberSince}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isEditing
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {isEditing ? (
                                <>
                                    <Save className="size-4" />
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <Edit2 className="size-4" />
                                    Edit Profile
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {/* Shop Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Store className="size-4" />
                                Shop Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.shopName}
                                    onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">{profile.shopName}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="size-4" />
                                Shop Address
                            </label>
                            {isEditing ? (
                                <textarea
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">{profile.address}</p>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Phone className="size-4" />
                                Contact Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={profile.contactNumber}
                                    onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                                    {profile.contactNumber}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Mail className="size-4" />
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">{profile.email}</p>
                            )}
                        </div>

                        {/* Working Hours */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="size-4" />
                                Working Hours
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.workingHours}
                                    onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                                    {profile.workingHours}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Read-Only Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">System Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Shop ID</p>
                            <p className="font-mono font-semibold text-gray-900">{profile.shopId}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Verification Status</p>
                            <div className="flex items-center gap-2">
                                <Shield className="size-4 text-green-600" />
                                <span className="font-semibold text-green-600">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
