import { useEffect, useState } from 'react';
import { attendanceApi } from '../api';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_LEAVE';

interface AttendanceRecord {
  id: number;
  date: string;
  status: AttendanceStatus;
  memo: string | null;
  student: { id: number; name: string };
  class: { id: number; name: string };
}

const statusLabel: Record<AttendanceStatus, string> = {
  PRESENT: '출석',
  ABSENT: '결석',
  LATE: '지각',
  EARLY_LEAVE: '조퇴'
};

const statusClass: Record<AttendanceStatus, string> = {
  PRESENT: 'badge-present',
  ABSENT: 'badge-absent',
  LATE: 'badge-late',
  EARLY_LEAVE: 'bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full'
};

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = () => {
    if (!classId) return;
    setLoading(true);
    attendanceApi.getByClass(parseInt(classId), date)
      .then(res => setRecords(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (classId) fetchAttendance();
  }, [classId, date]);

  const handleStatusChange = async (id: number, status: AttendanceStatus) => {
    try {
      await attendanceApi.update(id, { status });
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {}
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">출결 관리</h2>
        <p className="text-gray-500 text-sm mt-1">클래스별 출결 현황을 확인하고 관리하세요</p>
      </div>

      {/* 필터 */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">클래스 ID</label>
            <input
              type="number"
              placeholder="클래스 ID 입력"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="input-field w-40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field w-44"
            />
          </div>
          <div className="flex items-end">
            <button onClick={fetchAttendance} className="btn-primary">
              조회
            </button>
          </div>
        </div>
      </div>

      {/* 출결 목록 */}
      {!classId ? (
        <div className="card text-center py-16 text-gray-400">
          클래스 ID를 입력하고 조회 버튼을 눌러주세요
        </div>
      ) : loading ? (
        <div className="card text-center py-16 text-gray-400">불러오는 중...</div>
      ) : records.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">출결 기록이 없습니다.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">학생</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">클래스</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">날짜</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">메모</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">변경</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{record.student.name}</td>
                  <td className="px-6 py-4 text-gray-600">{record.class.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(record.date).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={statusClass[record.status]}>
                      {statusLabel[record.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{record.memo || '-'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.id, e.target.value as AttendanceStatus)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="PRESENT">출석</option>
                      <option value="ABSENT">결석</option>
                      <option value="LATE">지각</option>
                      <option value="EARLY_LEAVE">조퇴</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
