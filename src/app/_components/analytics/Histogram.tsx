import { MakeHistogram } from "@/app/helpers/StatisticsHelper";
import { Result } from "@/app/types";
import { Bar, BarChart, Tooltip, XAxis } from "recharts";
import React from "react";

interface Props {
  results: Result[];
}

function Histogram({ results }: Props) {
  const data = MakeHistogram(results);
  return (
    <BarChart data={data} height={450} width={675}>
      <XAxis dataKey="label" />
      <Tooltip />
      <Bar dataKey="value" fill="#002b5c" name="No. Students" />
    </BarChart>
  );
}

export default Histogram;
