import { useEffect, useState } from 'react';
import { assignmentsApi } from '../api';

interface Assignment {
  id: number;
  title: string;
  content: string | null;
  dueDate: string;
  class: { id: number; name: string };
  submissions: { id: number; studentId: number }[];
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', dueDate: '' });

  const fetchAssignments = () => {
    if (!classId) return;
    setLoading(true);
    assignmentsApi.getByClass(parseInt(classId))
      .then(res => setAssignments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (classId) fetchAssignments(); }, [classId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignmentsApi.create({ ...form, classId: parseInt(classId) });
      setShowForm(false);
      setForm({ title: '', content: '', dueDate: '' });
      fetchAssignments();
    } catch {}
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">과제 관리</h2>
          <p className="text-gray-500 text-sm mt-1">클래스별 과제를 관리하세요</p>
        </div>
        {classId && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            + 과제 출제
          </button>
        )}
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="number"
          placeholder="클래스 ID 입력"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="input-field w-40"
        />
        <button onClick={fetchAssignments} className="btn-secondary">조회</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900">새 과제 출제</h3>
          <input
            placeholder="과제 제목"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            required
            className="input-field"
          />
          <textarea
            placeholder="과제 내용"
            value={form.content}
            onChange={e => setForm({...form, content: e.target.value})}
            rows={3}
            className="input-field"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제출 기한</label>
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={e => setForm({...form, dueDate: e.target.value})}
              required
              className="input-field w-64"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">출제하기</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="card text-center py-16 text-gray-400">불러오는 중...</div>
      ) : !classId ? (
        <div className="card text-center py-16 text-gray-400">클래스 ID를 입력하고 조회하세요</div>
      ) : assignments.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">등록된 과제가 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  {a.content && <p className="text-gray-500 text-sm mt-1">{a.content}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    클래스: {a.class.name} · 제출기한: {new Date(a.dueDate).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary-600">{a.submissions.length}명 제출</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
