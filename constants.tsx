
import React from 'react';
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
