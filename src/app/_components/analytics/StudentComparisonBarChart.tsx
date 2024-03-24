import { Result } from "@/app/types";
import React from "react";
import { BarChart, Bar, YAxis, Tooltip, Cell, XAxis } from "recharts";

interface Props {
  selectedStudent: string;
  students: Result[];
}

function StudentComparisonBarChart({ selectedStudent, students }: Props) {
  return (
    <BarChart width={650} height={450} data={students}>
      <YAxis />
      <XAxis dataKey="null" label="Students" />
      <Tooltip />
      <Bar dataKey="mark" name="Mark" fill="#8884d8">
        {students.map((entry) => (
          <Cell
            key={entry.reg_number}
            fill={entry.reg_number === selectedStudent ? "red" : "#002b5c"}
          />
        ))}
      </Bar>
    </BarChart>
  );
}

export default StudentComparisonBarChart;
