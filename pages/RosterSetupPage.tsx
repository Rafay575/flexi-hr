import { RosterSelection } from "@/components/timesync/RosterSelection";
import { RosterPlanner } from "@/components/timesync/RosterPlanner";
import { Employee } from "@/components/timesync//types";
import { useState } from "react";

export const RosterSetupPage: React.FC = () => {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [isPlannerActive, setIsPlannerActive] = useState(false);

  if (isPlannerActive && selectedEmployees.length > 0) {
    return <RosterPlanner employees={selectedEmployees} />;
  }

  return (
    <RosterSelection
      onProceedToPlanner={(employees) => {
        setSelectedEmployees(employees);
        setIsPlannerActive(true);
      }} 
    />
  );
};