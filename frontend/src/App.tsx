import { useState } from 'react';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import Invoices from './pages/Invoices';
import Notices from './pages/Notices';

type Page = 'assignments' | 'attendance' | 'invoices' | 'notices';

const navItems: { id: Page; label: string; emoji: string }[] = [
  { id: 'assignments', label: '과제 관리', emoji: '📝' },
  { id: 'attendance', label: '출결 관리', emoji: '✅' },
  { id: 'invoices', label: '수납 관리', emoji: '💰' },
  { id: 'notices', label: '공지사항', emoji: '📢' },
  ];

export default function App() {
    const [currentPage, setCurrentPage] = useState<Page>('assignments');

  const renderPage = () => {
        switch (currentPage) {
          case 'assignments': return <Assignments />;
          case 'attendance': return <Attendance />;
          case 'invoices': return <Invoices />;
          case 'notices': return <Notices />;
          default: return <Assignments />;
        }
  };

  return (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
              <header className="bg-white border-b border-gray-200 shadow-sm">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                            <div className="flex items-center gap-3">
                                                          <span className="text-2xl">🏫</span>span>
                                                          <h1 className="text-xl font-bold text-gray-900">Academy App</h1>h1>
                                            </div>div>
                                            <nav className="flex gap-1">
                                              {navItems.map((item) => (
                          <button
                                              key={item.id}
                                              onClick={() => setCurrentPage(item.id)}
                                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                                    currentPage === item.id
                                                                      ? 'bg-primary-100 text-primary-700'
                                                                      : 'text-gray-600 hover:bg-gray-100'
                                              }`}
                                            >
                                            <span className="mr-1">{item.emoji}</span>span>
                            {item.label}
                          </button>button>
                        ))}
                                            </nav>nav>
                                </div>div>
                      </div>div>
              </header>header>
        
          {/* Main Content */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderPage()}
              </main>main>
        </div>div>
      );
}</div>
