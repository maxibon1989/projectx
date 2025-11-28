'use client';

import { useState } from 'react';
import { FiHome, FiUsers, FiCalendar, FiCheckSquare, FiFileText, FiSettings, FiHelpCircle, FiPlus, FiEdit2, FiTrash2, FiX, FiMenu } from 'react-icons/fi';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Home');
  const [taskFilter, setTaskFilter] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Meet your team', deadline: 'Today, 10:00', owner: 'Louise Green', completed: false, priority: false },
    { id: 2, title: 'Get access credentials from project manager', deadline: 'Today', owner: 'Louise Green', completed: false, priority: false },
    { id: 3, title: 'Read the brand book and UI kit', deadline: 'Today', owner: 'Louise Green', completed: false, priority: true },
    { id: 4, title: 'Review current project in Figma', deadline: 'Today', owner: 'Mark Fell', completed: false, status: 'In progress' },
    { id: 5, title: 'Review the employee handbook', deadline: 'Tomorrow, 14:00', owner: 'Anna Fish', completed: false, priority: false }
  ]);

  const [team] = useState([
    { id: 1, name: 'Louise Green', role: 'Team lead', avatar: '👩‍💼' },
    { id: 2, name: 'Mark Fell', role: 'Art director', avatar: '👨‍🎨' },
    { id: 3, name: 'Anna Fish', role: 'UX designer', avatar: '👩‍💻' },
    { id: 4, name: 'Kevin Less', role: 'UI designer', avatar: '👨‍💻' }
  ]);

  const [news] = useState([
    { id: 1, title: 'Q4 Strategic Planning Session Scheduled', date: '25 Nov 2025', type: 'Strategic' },
    { id: 2, title: 'Welcome New Team Members to Design', date: '24 Nov 2025', type: 'New hires' },
    { id: 3, title: 'Updated Remote Work Policy', date: '23 Nov 2025', type: 'Process' },
    { id: 4, title: 'Annual Company Retreat - Save the Date', date: '22 Nov 2025', type: 'Event' }
  ]);

  const [documents] = useState([
    { id: 1, name: 'Employee Handbook', folder: 'Policies' },
    { id: 2, name: 'Brand Guidelines', folder: 'Brand' },
    { id: 3, name: 'Project Templates', folder: 'Templates' }
  ]);

  const [goals] = useState([
    { id: 1, title: 'Get to know your team', progress: 72 },
    { id: 2, title: 'Set up work tools', progress: 12 },
    { id: 3, title: 'Complete your profile', progress: 95 }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'Completed') return task.completed;
    if (taskFilter === 'Uncompleted') return !task.completed;
    return true;
  });

  const metrics = {
    tasksCompleted: { 
      current: tasks.filter(t => t.completed).length, 
      total: tasks.length, 
      percentage: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0 
    },
    decisionsMade: { current: 5, total: 8, percentage: 63 }
  };

  const navItems = [
    { route: 'Home', icon: FiHome, label: 'Dashboard' },
    { route: 'Onboarding', icon: FiCheckSquare, label: 'Onboarding' },
    { route: 'Workflows', icon: FiFileText, label: 'Workflows' },
    { route: 'Knowledge', icon: FiFileText, label: 'Knowledge' },
    { route: 'Org', icon: FiUsers, label: 'Organization' },
    { route: 'Settings', icon: FiSettings, label: 'Settings' },
    { route: 'Support', icon: FiHelpCircle, label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
          <div className="p-6 flex items-center justify-between border-b">
            {sidebarOpen && <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => setActiveNav(item.route)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeNav === item.route
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Welcome, Max!</h1>
                  <p className="text-gray-500 mt-2">Friday, November 28, 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-6 py-3 bg-gray-100 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
                  </button>
                </div>
              </div>

              {/* User Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white flex items-center gap-6">
                <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center text-6xl">
                  👤
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold">Max Johansson</h2>
                  <p className="text-indigo-100 mt-1">Expansion Manager</p>
                  <p className="text-indigo-100 text-sm mt-2">Day 45 • Engineering Team</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#a8ff35" strokeWidth="8" fill="none" strokeDasharray={`${251 * 0.95} 251`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">95%</div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-600 font-medium">Tasks Completed</h3>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold text-gray-800">{metrics.tasksCompleted.current}/{metrics.tasksCompleted.total}</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 w-32">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: `${metrics.tasksCompleted.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{metrics.tasksCompleted.percentage}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-600 font-medium">Decisions Made</h3>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold text-gray-800">{metrics.decisionsMade.current}/{metrics.decisionsMade.total}</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 w-32">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: `${metrics.decisionsMade.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{metrics.decisionsMade.percentage}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Your Team</h3>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Show all</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {team.map((member) => (
                  <div key={member.id} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-3xl mb-3">
                      {member.avatar}
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800 text-sm">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* News & Documents */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Company News</h3>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Show all</button>
                </div>
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">{item.type}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Documents</h3>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Show all</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl hover:shadow-md transition cursor-pointer">
                      <div className="w-16 h-20 bg-white rounded-lg shadow-sm mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-gray-700">{doc.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{doc.folder}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Tasks & Goals */}
        <aside className="w-96 bg-white shadow-xl overflow-auto">
          <div className="p-6 space-y-6">
            {/* Task Tracker */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Task tracker</h3>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Show all</button>
              </div>
              
              <div className="flex gap-2 mb-6">
                {['All', 'Uncompleted', 'Completed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      taskFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                          task.completed
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-gray-300 hover:border-indigo-400'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm mb-2 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {task.title}
                        </h4>
                        {task.priority && (
                          <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full mb-2">
                            🔥 Do this first
                          </span>
                        )}
                        {task.status && (
                          <span className="inline-block text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mb-2 ml-2">
                            {task.status}
                          </span>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Deadline: {task.deadline}</span>
                          <span>•</span>
                          <span>{task.owner}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Tracker */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Goals tracker</h3>
              <p className="text-sm text-gray-500 mb-6">Supporting your onboarding journey</p>
              
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">{goal.title}</h4>
                      <span className="text-sm font-bold text-gray-800">{goal.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
