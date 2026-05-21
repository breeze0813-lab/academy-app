import { useEffect, useState } from 'react';
import { invoicesApi } from '../api';

interface Invoice {
  id: number;
  month: string;
  tuitionFee: number;
  extraFee: number;
  totalFee: number;
  dueDate: string;
  status: 'UNPAID' | 'PAID';
  paidAt: string | null;
  student: { id: number; name: string; phone: string };
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchInvoices = () => {
    setLoading(true);
    const params: { academyId?: number; status?: string } = {};
    if (user.academyId) params.academyId = user.academyId;
    if (filter !== 'ALL') params.status = filter;
    invoicesApi.getAll(params)
      .then(res => setInvoices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, [filter]);

  const handlePay = async (id: number) => {
    try {
      await invoicesApi.pay(id);
      setInvoices(prev => prev.map(inv =>
        inv.id === id ? { ...inv, status: 'PAID', paidAt: new Date().toISOString() } : inv
      ));
    } catch {}
  };

  const totalUnpaid = invoices.filter(i => i.status === 'UNPAID').reduce((s, i) => s + i.totalFee, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">수납 관리</h2>
          <p className="text-gray-500 text-sm mt-1">미납 합계: {totalUnpaid.toLocaleString()}원</p>
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-6">
        {(['ALL', 'UNPAID', 'PAID'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
              (filter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50')}
          >
            {f === 'ALL' ? '전체' : f === 'UNPAID' ? '미납' : '납부완료'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card text-center py-16 text-gray-400">불러오는 중...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">학생</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">청구월</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">수강료</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">합계</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">납부기한</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">청구서가 없습니다.</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{inv.student.name}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.month}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.tuitionFee.toLocaleString()}원</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{inv.totalFee.toLocaleString()}원</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(inv.dueDate).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={inv.status === 'PAID' ? 'badge-paid' : 'badge-unpaid'}>
                      {inv.status === 'PAID' ? '납부완료' : '미납'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {inv.status === 'UNPAID' && (
                      <button
                        onClick={() => handlePay(inv.id)}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        납부처리
                      </button>
                    )}
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
