import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    LogOut,
    CalendarDays,
    Music,
    FileText,
    Home as HomeIcon,
    ExternalLink,
    Lock,
    MessageSquareWarning,
    Users,
    Mic2,
    BellRing
} from 'lucide-react';
import { Link } from 'react-router-dom';

const fontInter = { fontFamily: 'Inter, sans-serif' };

const PORTAL_PASSWORD = 'vocalumembers';

export function Portal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem('vu_portal_auth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === PORTAL_PASSWORD) {
            localStorage.setItem('vu_portal_auth', 'true');
            setIsAuthenticated(true);
            setAuthError(false);
        } else {
            setAuthError(true);
            setPasswordInput('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('vu_portal_auth');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4" style={fontInter}>
                <Helmet>
                    <title>Member Login | Vocal U</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <div className="bg-[#8FA8C8]/10 w-20 h-20 rounded-full flex items-center justify-center shadow-sm">
                            <Lock className="w-10 h-10 text-[#2B4C6F]" />
                        </div>
                    </div>


                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Password"
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FA8C8]/50 transition-colors ${authError ? 'border-red-500' : 'border-gray-200'}`}
                                autoFocus
                            />
                            {authError && <p className="text-red-500 text-xs mt-2">Incorrect password. Please try again.</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#2B4C6F] text-white py-3 rounded-lg font-medium hover:bg-[#1a3249] transition-colors"
                        >
                            Sign In
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-[#8FA8C8] hover:text-[#2B4C6F] text-sm transition-colors">
                            &larr; Back to Public Site
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard / Home', icon: HomeIcon },
        { id: 'repertoire', label: 'Music Resources', icon: Music },
        { id: 'documents', label: 'Operations', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row" style={fontInter}>
            <Helmet>
                <title>Member Portal | Vocal U</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Mobile Header Sidebar Toggle */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
                <h1 className="font-bold text-[#2B4C6F] text-lg">VU Portal</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-100 rounded-md">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 h-screen md:h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-20 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-lg md:shadow-none`}>
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-[#2B4C6F] font-bold text-xl tracking-tight">Vocal U<br /><span className="text-[#8FA8C8]">Member Portal</span></h2>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-[#2B4C6F] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden pt-4 md:pt-8 px-4 md:px-8 pb-12 w-full max-w-5xl mx-auto">

                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Master Calendar & Rehearsals</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Calendar */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-2 text-sm rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[450px]">
                                    <iframe
                                        src="https://calendar.google.com/calendar/embed?src=c_9665091fd0df076632fda843b14a9c87c7c11ec0a0dcea1f450511c0cec22fae%40group.calendar.google.com&ctz=America%2FChicago"
                                        style={{ border: 0 }}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        title="Vocal U Master Calendar"
                                    ></iframe>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-[#2B4C6F]">
                                        <BellRing className="w-5 h-5" />
                                        <h3 className="font-bold text-lg">Announcements</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">New</span>
                                            <p className="text-gray-700 text-sm mt-1">Check out the updated gig schedule on the master calendar. Any major conflicts must be communicated ASAP.</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column: Key Details */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-[#2B4C6F] to-[#1a3249] p-6 rounded-xl border border-[#1a3249] shadow-sm text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-lg"></div>
                                    <h3 className="font-bold text-xl mb-2 flex items-center gap-2 relative z-10">
                                        <CalendarDays className="w-5 h-5 text-[#8FA8C8]" />
                                        Next Rehearsal
                                    </h3>
                                    <div className="mt-4 space-y-3 text-sm relative z-10">
                                        <p className="flex justify-between"><span className="text-white/60">Time:</span> <strong>See Calendar</strong></p>
                                        <p className="flex justify-between"><span className="text-white/60">Location:</span> <strong>Check Slack</strong></p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-yellow-400">
                                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                        <MessageSquareWarning className="w-5 h-5 text-yellow-500" />
                                        Action Items
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <input type="checkbox" className="mt-1 flex-shrink-0 cursor-pointer text-[#8FA8C8] focus:ring-[#8FA8C8]" />
                                            <span className="text-sm text-gray-700 font-medium">Check Slack for availability polls</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <input type="checkbox" className="mt-1 flex-shrink-0 cursor-pointer text-[#8FA8C8] focus:ring-[#8FA8C8]" />
                                            <span className="text-sm text-gray-700 font-medium">Practice your assigned music!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links Section */}
                        <h3 className="font-bold text-lg text-gray-900 mb-2 mt-8 px-2 border-b pb-2 border-gray-200">Quick Access</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link to="/events" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#8FA8C8] flex flex-col items-center justify-center text-center group transition-colors">
                                <Mic2 className="w-6 h-6 text-[#2B4C6F] mb-2 group-hover:text-[#8FA8C8] transition-colors" />
                                <span className="text-sm font-semibold text-gray-800">Events & Gigs</span>
                            </Link>
                            <Link to="/members" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#8FA8C8] flex flex-col items-center justify-center text-center group transition-colors">
                                <Users className="w-6 h-6 text-[#2B4C6F] mb-2 group-hover:text-[#8FA8C8] transition-colors" />
                                <span className="text-sm font-semibold text-gray-800">Member Directory</span>
                            </Link>
                            <Link to="/about" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#8FA8C8] flex flex-col items-center justify-center text-center group transition-colors">
                                <FileText className="w-6 h-6 text-[#2B4C6F] mb-2 group-hover:text-[#8FA8C8] transition-colors" />
                                <span className="text-sm font-semibold text-gray-800">About Us</span>
                            </Link>
                            <Link to="/" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#8FA8C8] flex flex-col items-center justify-center text-center group transition-colors">
                                <HomeIcon className="w-6 h-6 text-[#2B4C6F] mb-2 group-hover:text-[#8FA8C8] transition-colors" />
                                <span className="text-sm font-semibold text-gray-800">Public Home</span>
                            </Link>
                        </div>

                        {/* Officer Corners Section */}
                        <h3 className="font-bold text-lg text-gray-900 mb-2 mt-10 px-2 border-b pb-2 border-gray-200">Officer Corners</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* President */}
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#8FA8C8] transition-all">
                                <h4 className="font-bold text-[#2B4C6F] flex items-center gap-3 mb-4">
                                    <span className="bg-blue-50 p-2 rounded-lg border border-blue-100"><Users className="w-5 h-5 text-blue-600" /></span>
                                    President
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Roster Management</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Constitution Updates</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Alumni Network</a></li>
                                </ul>
                            </div>

                            {/* Music Director */}
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#8FA8C8] transition-all">
                                <h4 className="font-bold text-[#2B4C6F] flex items-center gap-3 mb-4">
                                    <span className="bg-indigo-50 p-2 rounded-lg border border-indigo-100"><Music className="w-5 h-5 text-indigo-600" /></span>
                                    Music Director
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Setlist Planner</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Drive & Sheet Music</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Arrangement Subs</a></li>
                                </ul>
                            </div>

                            {/* Business Manager */}
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#8FA8C8] transition-all">
                                <h4 className="font-bold text-[#2B4C6F] flex items-center gap-3 mb-4">
                                    <span className="bg-green-50 p-2 rounded-lg border border-green-100"><FileText className="w-5 h-5 text-green-600" /></span>
                                    Business Manager
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Treasury & Dues Map</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Gig Contracts</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Merch Orders</a></li>
                                </ul>
                            </div>

                            {/* PR / Marketing */}
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#8FA8C8] transition-all">
                                <h4 className="font-bold text-[#2B4C6F] flex items-center gap-3 mb-4">
                                    <span className="bg-purple-50 p-2 rounded-lg border border-purple-100"><Mic2 className="w-5 h-5 text-purple-600" /></span>
                                    PR & Marketing
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Social Media Assets</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Brand Guidelines</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Content Calendar</a></li>
                                </ul>
                            </div>

                            {/* Social Chair */}
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#8FA8C8] transition-all">
                                <h4 className="font-bold text-[#2B4C6F] flex items-center gap-3 mb-4">
                                    <span className="bg-pink-50 p-2 rounded-lg border border-pink-100"><CalendarDays className="w-5 h-5 text-pink-600" /></span>
                                    Social Chair
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Retreat Planning</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Event Proposals</a></li>
                                    <li><a href="#" className="flex items-center gap-2 hover:text-[#2B4C6F] hover:font-medium transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Member Birthdays</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* REPERTOIRE */}
                {activeTab === 'repertoire' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-2">
                            <h2 className="text-2xl font-bold text-gray-900">Music Resources</h2>
                            <a href="https://drive.google.com/drive/folders/1ijPjbVvQpAJ917II7ZUZPXblDI3TP2zW?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-[#2B4C6F] hover:underline text-sm font-medium flex items-center gap-1 w-fit bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">
                                Master Drive Folder <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <a href="https://drive.google.com/drive/folders/1ijPjbVvQpAJ917II7ZUZPXblDI3TP2zW?usp=drive_link" target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#8FA8C8] hover:shadow-md transition-all h-full">
                                    <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                                        <FileText className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">Sheet Music PDF's</h3>
                                    <p className="text-sm text-gray-500">Access all current and past sheet music files safely curated in our Drive folder.</p>
                                </div>
                            </a>

                            <a href="https://drive.google.com/drive/folders/1ijPjbVvQpAJ917II7ZUZPXblDI3TP2zW?usp=drive_link" target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#8FA8C8] hover:shadow-md transition-all h-full">
                                    <div className="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                        <Mic2 className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">Learning Tracks</h3>
                                    <p className="text-sm text-gray-500">Audio tracks for Soprano, Alto, Tenor, Bass, and VP parts to practice alongside.</p>
                                </div>
                            </a>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
                            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <MessageSquareWarning className="w-4 h-4 text-[#2B4C6F]" /> Practice Expectations
                            </h4>
                            <p className="text-sm text-gray-600">Please prepare your assigned parts thoroughly outside of rehearsal hours. Rehearsal is for blending as a group, not learning notes!</p>
                        </div>
                    </div>
                )}

                {/* DOCUMENTS */}
                {activeTab === 'documents' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Operations & Forms</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <CalendarDays className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900">Absence Request</h3>
                                <p className="text-sm text-gray-500 mb-6 px-4">Let the Exec board know if you have any scheduling conflicts as far in advance as possible.</p>
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm border border-gray-300">
                                    <ExternalLink className="w-4 h-4" />
                                    Submit Absence Form
                                </button>
                            </div>

                            <a href="#" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#8FA8C8] transition-colors flex flex-col items-center justify-center text-center group">
                                <div className="bg-[#2B4C6F]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-6 h-6 text-[#2B4C6F]" />
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-[#2B4C6F]">Vocal U Constitution</h3>
                                <p className="text-sm text-gray-500 mt-2 px-4">Read our group bylaws, policies, and official standing rules.</p>
                                <span className="text-[#8FA8C8] text-xs font-bold tracking-widest mt-4">DOWNLOAD PDF</span>
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
                            <div className="max-w-xl">
                                <h3 className="font-bold text-lg mb-2 text-gray-900 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                    Anonymous Feedback Form
                                </h3>
                                <p className="text-sm text-gray-500 mb-5">Have a suggestion or concern? Use this form to submit feedback anonymously directly to the Executive Board. We value everyone's voice.</p>
                                <form className="space-y-4">
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#8FA8C8] focus:border-[#8FA8C8] outline-none transition-shadow min-h-[120px]"
                                        placeholder="Type your feedback here..."
                                    ></textarea>
                                    <button type="button" className="bg-[#2B4C6F] text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-[#1a3249]">Submit Feedback</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
