import { useEffect, useState } from 'react';
import { noticesApi } from '../api';

interface Notice {
  id: number;
  title: string;
  content: string;
  targetType: 'ALL' | 'CLASS' | 'INDIVIDUAL';
  createdAt: string;
  author: { id: number; name: string; role: string };
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', targetType: 'ALL' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchNotices = () => {
    if (!user.academyId) return;
    noticesApi.getByAcademy(user.academyId)
      .then(res => setNotices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await noticesApi.create({ ...form, academyId: user.academyId });
      setShowForm(false);
      setForm({ title: '', content: '', targetType: 'ALL' });
      fetchNotices();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm('공지를 삭제하시겠습니까?')) return;
    try {
      await noticesApi.delete(id);
      setNotices(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const targetLabel = { ALL: '전체', CLASS: '클래스', INDIVIDUAL: '개인' };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">공지 관리</h2>
          <p className="text-gray-500 text-sm mt-1">학원 공지를 작성하고 관리하세요</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + 공지 작성
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900">새 공지 작성</h3>
          <input
            placeholder="공지 제목"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            required
            className="input-field"
          />
          <textarea
            placeholder="공지 내용을 입력하세요..."
            value={form.content}
            onChange={e => setForm({...form, content: e.target.value})}
            required
            rows={4}
            className="input-field"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대상</label>
            <select
              value={form.targetType}
              onChange={e => setForm({...form, targetType: e.target.value})}
              className="input-field w-40"
            >
              <option value="ALL">전체</option>
              <option value="CLASS">클래스</option>
              <option value="INDIVIDUAL">개인</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">공지 등록</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="card text-center py-16 text-gray-400">불러오는 중...</div>
      ) : notices.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">등록된 공지가 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
                      {targetLabel[notice.targetType]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{notice.title}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{notice.content}</p>
                  <p className="text-xs text-gray-400 mt-2">작성자: {notice.author.name}</p>
                </div>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="ml-4 text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
