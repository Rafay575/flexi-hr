
import React from 'react';
import { LeaveType, ApprovalStatus, LeaveRequest, LeaveBalance } from './types';
import { 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Coffee,
  MapPin
} from 'lucide-react';

export const COLORS = {
  primary: '#3E3B6F',
  accent1: '#E8D5A3',
  accent2: '#E8B4A0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
};

export const MOCK_STATS = {
  totalEmployees: 156,
  presentToday: 142,
  onLeave: 8,
  lateArrivals: 6
};

export const MOCK_ATTENDANCE = [
  { id: '1', employeeName: 'Sarah Jenkins', employeeId: 'FLX-001', date: '2023-10-25', clockIn: '08:45 AM', clockOut: '05:30 PM', status: 'Present', workHours: 8.75 },
  { id: '2', employeeName: 'Michael Chen', employeeId: 'FLX-024', date: '2023-10-25', clockIn: '09:15 AM', clockOut: '06:00 PM', status: 'Late', workHours: 8.75 },
  { id: '3', employeeName: 'Amara Okafor', employeeId: 'FLX-112', date: '2023-10-25', clockIn: '08:55 AM', clockOut: null, status: 'Present', workHours: 0 },
  { id: '4', employeeName: 'David Miller', employeeId: 'FLX-089', date: '2023-10-25', clockIn: '08:30 AM', clockOut: '05:00 PM', status: 'Remote', workHours: 8.5 },
  { id: '5', employeeName: 'Elena Rodriguez', employeeId: 'FLX-045', date: '2023-10-25', clockIn: '-', clockOut: '-', status: 'On Leave', workHours: 0 },
];

export const MOCK_LEAVES = [
  { id: 'L1', employeeName: 'John Doe', type: 'Sick Leave', startDate: '2023-10-26', endDate: '2023-10-27', status: 'Pending', reason: 'Flu recovery' },
  { id: 'L2', employeeName: 'Lisa Wong', type: 'Annual Leave', startDate: '2023-11-01', endDate: '2023-11-05', status: 'Approved', reason: 'Family vacation' },
  { id: 'L3', employeeName: 'Robert Smith', type: 'Personal', startDate: '2023-10-25', endDate: '2023-10-25', status: 'Rejected', reason: 'High workload period' },
];


export const INITIAL_BALANCES: LeaveBalance[] = [
  { type: LeaveType.ANNUAL, total: 24, used: 8, remaining: 16 },
  { type: LeaveType.SICK, total: 12, used: 2, remaining: 10 },
  { type: LeaveType.CASUAL, total: 10, used: 3, remaining: 7 },
  { type: LeaveType.MATERNITY, total: 90, used: 0, remaining: 90 },
];

export const MOCK_HISTORY: LeaveRequest[] = [
  {
    id: 'LV-1024',
    type: LeaveType.ANNUAL,
    startDate: '2023-12-20',
    endDate: '2023-12-24',
    days: 5,
    reason: 'Family vacation to the mountains.',
    status: ApprovalStatus.APPROVED,
    appliedDate: '2023-12-01',
  },
  {
    id: 'LV-1025',
    type: LeaveType.SICK,
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    days: 1,
    reason: 'Severe migraine.',
    status: ApprovalStatus.APPROVED,
    appliedDate: '2024-01-14',
  },
  {
    id: 'LV-1028',
    type: LeaveType.CASUAL,
    startDate: '2024-02-10',
    endDate: '2024-02-11',
    days: 2,
    reason: 'Personal administrative work.',
    status: ApprovalStatus.PENDING,
    appliedDate: '2024-02-05',
  }
];
