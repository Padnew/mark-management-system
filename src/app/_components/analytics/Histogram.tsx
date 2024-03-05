import { MakeHistogram } from "@/app/helpers/StatisticsHelper";
import { Result } from "@/app/types";
import { BarChart } from "@mantine/charts";
import React from "react";

interface Props {
  results: Result[];
}

function Histogram({ results }: Props) {
  const data = MakeHistogram(results);
  return (
    <BarChart
      w={650}
      h={450}
      data={data}
      dataKey="label"
      series={[{ name: "value", color: "#002b5c", label: "No. Students" }]}
      tooltipProps={{ cursor: { fill: "none" } }}
    />
  );
}

export default Histogram;
