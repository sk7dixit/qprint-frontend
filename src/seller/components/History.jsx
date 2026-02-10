import { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Filter } from 'lucide-react';

// Mock data
const mockHistory = [
    {
        id: 'J023',
        fileName: 'Assignment_Chapter_5.pdf',
        pages: 12,
        color: 'bw',
        copies: 1,
        studentName: 'Rahul Kumar',
        status: 'completed',
        completedDate: new Date(Date.now() - 2 * 60000),
        amount: 45,
    },
    {
        id: 'J022',
        fileName: 'Project_Report_Final.pdf',
        pages: 45,
        color: 'color',
        copies: 2,
        studentName: 'Priya Sharma',
        status: 'completed',
        completedDate: new Date(Date.now() - 15 * 60000),
        amount: 120,
    },
    {
        id: 'J020',
        fileName: 'Resume_2024.pdf',
        pages: 2,
        color: 'bw',
        copies: 5,
        studentName: 'Sneha Reddy',
        status: 'completed',
        completedDate: new Date(Date.now() - 40 * 60000),
        amount: 65,
    },
    {
        id: 'J019',
        fileName: 'Presentation_Slides.pdf',
        pages: 20,
        color: 'color',
        copies: 1,
        studentName: 'Vikram Singh',
        status: 'completed',
        completedDate: new Date(Date.now() - 60 * 60000),
        amount: 90,
    },
    {
        id: 'J018',
        fileName: 'Corrupted_File.pdf',
        pages: 0,
        color: 'bw',
        copies: 1,
        studentName: 'Ankit Verma',
        status: 'rejected',
        completedDate: new Date(Date.now() - 120 * 60000),
        rejectionReason: 'File is corrupted and cannot be opened',
        amount: 0,
    },
    {
        id: 'J017',
        fileName: 'Notes_Mathematics.pdf',
        pages: 25,
        color: 'bw',
        copies: 2,
        studentName: 'Neha Gupta',
        status: 'completed',
        completedDate: new Date(Date.now() - 180 * 60000),
        amount: 75,
    },
    {
        id: 'J016',
        fileName: 'Large_Book.pdf',
        pages: 500,
        color: 'bw',
        copies: 1,
        studentName: 'Rohan Shah',
        status: 'rejected',
        completedDate: new Date(Date.now() - 240 * 60000),
        rejectionReason: 'Too many pages. Exceeds printer capacity',
        amount: 0,
    },
];

export default function History() {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = mockHistory.filter((job) => {
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        const matchesSearch =
            job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const formatTime = (date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const completedCount = mockHistory.filter((j) => j.status === 'completed').length;
    const rejectedCount = mockHistory.filter((j) => j.status === 'rejected').length;

    return (
        <div className="size-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Job History</h1>
                <p className="text-gray-500 font-medium">Reference and review past jobs</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gray-100 p-2 rounded-lg">
                            <FileText className="size-5 text-gray-700" />
                        </div>
                        <span className="text-sm text-gray-600">Total Jobs</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{mockHistory.length}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle2 className="size-5 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{completedCount}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <XCircle className="size-5 text-red-600" />
                        </div>
                        <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{rejectedCount}</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Job ID, filename, or student name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filterStatus === 'all'
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('completed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filterStatus === 'completed'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilterStatus('rejected')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filterStatus === 'rejected'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Rejected
                        </button>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Job Info
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Student
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Details
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Date
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <FileText className="size-4 text-gray-700" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm font-medium text-gray-900">
                                                    {job.id}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                                    {job.fileName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{job.studentName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">
                                            <span>{job.pages} pages</span>
                                            <span className="mx-2">•</span>
                                            <span>{job.color === 'color' ? 'Color' : 'B&W'}</span>
                                            <span className="mx-2">•</span>
                                            <span>{job.copies}x</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {formatTime(job.completedDate)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {job.status === 'completed' ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle2 className="size-3" />
                                                Completed
                                            </span>
                                        ) : (
                                            <div className="space-y-1">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    <XCircle className="size-3" />
                                                    Rejected
                                                </span>
                                                {job.rejectionReason && (
                                                    <p className="text-xs text-gray-500 max-w-xs">
                                                        {job.rejectionReason}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">
                                            {job.amount > 0 ? `₹${job.amount}` : '-'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="size-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No jobs found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
