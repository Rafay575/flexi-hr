
import React from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const StatusBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
  const styles: Record<string, string> = {
    [AttendanceStatus.PRESENT]: 'bg-green-100 text-green-700',
    [AttendanceStatus.LATE]: 'bg-yellow-100 text-yellow-700',
    [AttendanceStatus.ABSENT]: 'bg-red-100 text-red-700',
    [AttendanceStatus.REMOTE]: 'bg-blue-100 text-blue-700',
    [AttendanceStatus.ON_LEAVE]: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Clock In</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Clock Out</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Hours</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.employeeId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.clockIn}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.clockOut || '--:--'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={record.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {record.workHours > 0 ? `${record.workHours}h` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
