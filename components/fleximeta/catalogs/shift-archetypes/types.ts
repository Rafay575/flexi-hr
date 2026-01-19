// ==================== SHIFT ARCHETYPE TYPES ====================
export interface ApiShiftArchetype {
  id: number;
  code: string;
  name: string;
  start_time: string;
  end_time: string;
  break_min: number;
  night_shift: boolean;
  ot_rule_json: {
    ot_after_min: number;
    multiplier: number;
  };
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShiftArchetype {
  id: string;
  code: string;
  name: string;
  start_time: string;
  end_time: string;
  break_min: number;
  night_shift: boolean;
  ot_rule_json: {
    ot_after_min: number;
    multiplier: number;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShiftArchetypeRow extends ShiftArchetype {
  sr: number;
}
export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
export interface ShiftArchetypesResponse {
  data: ShiftArchetype[];
  meta: ApiMeta;
}

export interface FrontendShiftArchetypesResponse extends ShiftArchetypesResponse {}

// ==================== SHIFT ARCHETYPE FORM TYPES ====================
export interface ShiftArchetypeFormData {
  code: string;
  name: string;
  start_time: string;
  end_time: string;
  break_min: number;
  night_shift: boolean;
  ot_rule_json: {
    ot_after_min: number;
    multiplier: number;
  };
  active: boolean;
}

// ==================== TIME FORMATTING ====================
export const formatTimeForDisplay = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatTimeForInput = (timeString: string) => {
  return timeString; // Already in HH:MM:SS format
};

export const calculateDuration = (startTime: string, endTime: string, breakMin: number) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let startInMinutes = startHour * 60 + startMin;
  let endInMinutes = endHour * 60 + endMin;
  
  // Handle overnight shifts
  if (endInMinutes < startInMinutes) {
    endInMinutes += 24 * 60; // Add 24 hours
  }
  
  const totalMinutes = endInMinutes - startInMinutes - breakMin;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes, totalMinutes: totalMinutes + breakMin };
};