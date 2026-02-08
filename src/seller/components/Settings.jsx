import { useState } from 'react';
import { Circle, Bell, Zap, Palette, Printer } from 'lucide-react';

export function Settings({ isOnline, setIsOnline }) {
    const [settings, setSettings] = useState({
        notifications: true,
        autoAcceptJobs: false,
        colorPrinting: true,
        bwPrinting: true,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="size-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Settings</h1>
                <p className="text-gray-500 font-medium">Minimal, focused configuration</p>
            </div>

            {/* Availability Control - Most Important */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div
                            className={`p-3 rounded-xl ${isOnline ? 'bg-green-100' : 'bg-red-100'
                                }`}
                        >
                            <Circle
                                className={`size-6 fill-current ${isOnline ? 'text-green-600' : 'text-red-600'
                                    }`}
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Shop Availability</h2>
                            <p className="text-gray-600">
                                {isOnline
                                    ? 'Your shop is online and accepting print jobs'
                                    : 'Your shop is offline. No new jobs will be received'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOnline
                            ? 'bg-green-600 focus:ring-green-500'
                            : 'bg-gray-300 focus:ring-gray-400'
                            }`}
                    >
                        <span
                            className={`inline-block size-6 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-9' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Operational Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Operational Settings</h2>

                <div className="space-y-4">
                    {/* Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Bell className="size-5 text-gray-600" />
                            <div>
                                <h3 className="font-medium text-gray-900">Notifications</h3>
                                <p className="text-sm text-gray-600">
                                    Get notified about new jobs and messages
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting('notifications')}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block size-5 transform rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-8' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Auto-Accept Jobs */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Zap className="size-5 text-gray-600" />
                            <div>
                                <h3 className="font-medium text-gray-900">Auto-Accept Jobs</h3>
                                <p className="text-sm text-gray-600">
                                    Automatically accept all incoming print jobs
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting('autoAcceptJobs')}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.autoAcceptJobs ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block size-5 transform rounded-full bg-white transition-transform ${settings.autoAcceptJobs ? 'translate-x-8' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Printer Capabilities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Printer className="size-6 text-gray-700" />
                    <h2 className="text-xl font-bold text-gray-900">Printer Capabilities</h2>
                </div>

                <div className="space-y-4">
                    {/* Color Printing */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Palette className="size-5 text-gray-600" />
                            <div>
                                <h3 className="font-medium text-gray-900">Color Printing</h3>
                                <p className="text-sm text-gray-600">Accept color print jobs</p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting('colorPrinting')}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.colorPrinting ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block size-5 transform rounded-full bg-white transition-transform ${settings.colorPrinting ? 'translate-x-8' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* B&W Printing */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="size-5 rounded bg-gray-800" />
                            <div>
                                <h3 className="font-medium text-gray-900">Black & White Printing</h3>
                                <p className="text-sm text-gray-600">Accept B&W print jobs</p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleSetting('bwPrinting')}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.bwPrinting ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block size-5 transform rounded-full bg-white transition-transform ${settings.bwPrinting ? 'translate-x-8' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Paper Sizes - Display Only */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Supported Paper Sizes</h3>
                        <div className="flex flex-wrap gap-2">
                            {['A4', 'A3', 'Letter', 'Legal'].map((size) => (
                                <span
                                    key={size}
                                    className="px-3 py-1 bg-white border border-blue-200 rounded-full text-sm text-gray-700"
                                >
                                    {size}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gray-100 border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Note:</span> These settings help the system route
                    appropriate jobs to your shop. Changing availability will immediately affect job
                    acceptance.
                </p>
            </div>
        </div>
    );
}
