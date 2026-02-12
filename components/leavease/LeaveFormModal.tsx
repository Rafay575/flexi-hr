
import React, { useState } from 'react';
import { LeaveType, LeaveRequest, LeaveStatus } from '../../types';
import { X, Calendar as CalendarIcon, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Partial<LeaveRequest>) => void;
  isSubmitting: boolean;
}

const LeaveFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    type: LeaveType.ANNUAL,
    startDate: '',
    endDate: '',
    reason: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: LeaveStatus.PENDING,
      appliedDate: new Date().toISOString().split('T')[0],
      days: calculateDays(formData.startDate, formData.endDate),
    });
  };

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-primary-gradient p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">New Leave Application</h2>
            <p className="text-white/70 text-sm">Please fill in the details for your request.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Leave Type</label>
              <select
                required
                className="w-full border-2 border-gray-100 rounded-lg p-3 outline-none focus:border-[#3E3B6F] transition-colors"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveType })}
              >
                {Object.values(LeaveType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Estimated Days</label>
              <div className="w-full bg-gray-50 border-2 border-gray-100 rounded-lg p-3 text-gray-600 font-bold">
                {calculateDays(formData.startDate, formData.endDate)} Days
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Start Date</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  className="w-full border-2 border-gray-100 rounded-lg p-3 pl-10 outline-none focus:border-[#3E3B6F] transition-colors"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                <CalendarIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">End Date</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  min={formData.startDate}
                  className="w-full border-2 border-gray-100 rounded-lg p-3 pl-10 outline-none focus:border-[#3E3B6F] transition-colors"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <CalendarIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Reason</label>
            <textarea
              required
              rows={3}
              placeholder="Brief description of your leave..."
              className="w-full border-2 border-gray-100 rounded-lg p-3 outline-none focus:border-[#3E3B6F] transition-colors resize-none"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#3E3B6F] text-white font-bold rounded-lg hover:bg-[#4A4680] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveFormModal;
