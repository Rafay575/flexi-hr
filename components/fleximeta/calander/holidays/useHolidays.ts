import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { api } from "@/components/api/client";
import { HolidaysResponse } from './types';

// GET - Fetch holidays with pagination and filters
export const useHolidays = (
  page: number = 1,
  perPage: number = 10,
  q: string = '',
  year?: string,
  countryId?: string,
  active?: string
): UseQueryResult<HolidaysResponse> => {
  return useQuery({
    queryKey: ['holidays', page, perPage, q, year, countryId, active],
    queryFn: async () => {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (q) params.q = q;
      if (year) params.year = year;
      if (countryId) params.country_id = countryId;
      if (active && active !== 'all') params.active = active === 'active' ? 1 : 0;

      const { data } = await api.get(`/meta/companies/calendars/holiday_templates`, { params });
      return data;
    },
  });
};

// GET - Fetch holidays by year
export const useHolidaysByYear = (year: number): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['holidays-year', year],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/calendars/holiday_templates`, {
        params: { year, per_page: 'all' },
      });
      return data.data || [];
    },
    enabled: !!year,
  });
};

// GET - Fetch upcoming holidays (next 30 days)
export const useUpcomingHolidays = (limit: number = 5): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['holidays-upcoming', limit],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      const endDate = thirtyDaysLater.toISOString().split('T')[0];

      const { data } = await api.get(`/meta/companies/calendars/holiday_templates`, {
        params: {
          date_from: today,
          date_to: endDate,
          per_page: limit,
          active: 1,
        },
      });
      return data.data || [];
    },
  });
};

// GET - Fetch holidays for calendar view
export const useHolidaysForCalendar = (
  year: number,
  month?: number
): UseQueryResult<any[]> => {
  return useQuery({
    queryKey: ['holidays-calendar', year, month],
    queryFn: async () => {
      const params: any = { year, per_page: 'all' };
      if (month) params.month = month;
      
      const { data } = await api.get(`/meta/companies/calendars/holiday_templates`, { params });
      return data.data || [];
    },
  });
};

// Utility function to check if a date is a holiday
export const useIsHoliday = (date: Date): UseQueryResult<boolean> => {
  const dateStr = date.toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['is-holiday', dateStr],
    queryFn: async () => {
      const { data } = await api.get(`/meta/companies/calendars/holiday_templates`, {
        params: { 
          date: dateStr,
          active: 1,
          per_page: 1 
        },
      });
      return data.data && data.data.length > 0;
    },
  });
};