import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Play, Calendar, TrendingUp, Home, User, Settings, Dumbbell } from 'lucide-react';

const data = [
    { name: 'W1', weight: 78 },
    { name: 'W2', weight: 77.5 },
    { name: 'W3', weight: 76.8 },
    { name: 'W4', weight: 76.2 },
    { name: 'W5', weight: 75.5 },
    { name: 'W6', weight: 75.8 },
    { name: 'W7', weight: 75.0 },
];

const UserDashboard = ({ onStartOnboarding }) => {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen w-full flex-col bg-brand-black pb-24 text-white md:pl-24 md:pb-0">
            {/* Desktop Sidebar / Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-white/10 bg-brand-black/90 px-6 py-4 backdrop-blur-md md:top-0 md:h-screen md:w-24 md:flex-col md:justify-start md:gap-12 md:border-r md:border-t-0 md:pt-12">
                <div className="hidden md:flex md:justify-center">
                    <div className="h-8 w-8 rounded-full bg-brand-red"></div>
                </div>
                <button className="flex flex-col items-center gap-1 text-brand-red">
                    <Home size={24} />
                    <span className="text-[10px] font-medium uppercase">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white">
                    <Calendar size={24} />
                    <span className="text-[10px] font-medium uppercase">Plan</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white">
                    <TrendingUp size={24} />
                    <span className="text-[10px] font-medium uppercase">Stats</span>
                </button>
                <button onClick={logout} className="flex flex-col items-center gap-1 text-white/50 hover:text-white md:mt-auto md:mb-8">
                    <User size={24} />
                    <span className="text-[10px] font-medium uppercase">Profile</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 px-6 py-8 md:px-12 md:py-12">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold">
                            Welcome back, <span className="text-brand-red">{user?.name?.split(' ')[0] || 'Athlete'}</span>
                        </h1>
                        <p className="text-white/50">Week 4 • Strength Phase</p>
                    </div>
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=D62828&color=fff`} alt="Profile" />
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Today's Workout Card */}
                    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-6 transition-all hover:border-brand-red/50 lg:col-span-2">
                        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-red/10 blur-[80px]"></div>

                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <span className="mb-2 inline-block rounded-full bg-brand-red/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-red">
                                    Today's Session
                                </span>
                                <h2 className="font-display text-4xl font-bold uppercase italic">Upper Body <br /> Power</h2>
                                <div className="mt-4 flex gap-4 text-sm text-white/60">
                                    <span className="flex items-center gap-1"><Dumbbell size={16} /> 6 Exercises</span>
                                    <span className="flex items-center gap-1"><TrendingUp size={16} /> High Intensity</span>
                                </div>
                            </div>
                            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-white shadow-lg shadow-brand-red/20 transition-transform group-hover:scale-110">
                                <Play fill="currentColor" className="ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions / Onboarding Trigger */}
                    <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-surface p-6">
                        <div>
                            <h3 className="font-display text-xl font-bold">Pending Actions</h3>
                            <p className="text-sm text-white/50">Complete your profile setup.</p>
                        </div>
                        <button
                            onClick={onStartOnboarding}
                            className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-medium transition-colors hover:bg-white/10"
                        >
                            Update Biometrics
                        </button>
                    </div>

                    {/* Progress Chart */}
                    <div className="rounded-3xl border border-white/10 bg-surface p-6 lg:col-span-3">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-display text-xl font-bold">Weight Evolution</h3>
                            <select className="rounded-lg bg-white/5 px-3 py-1 text-sm text-white/70 outline-none">
                                <option>Last 7 Weeks</option>
                                <option>Last 3 Months</option>
                            </select>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#D62828"
                                        strokeWidth={3}
                                        dot={{ fill: '#D62828', strokeWidth: 2, r: 4, stroke: '#050505' }}
                                        activeDot={{ r: 6, fill: '#fff' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
