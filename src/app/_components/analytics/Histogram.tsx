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
      color="red"
      w={650}
      h={450}
      style={{}}
      data={data}
      dataKey="label"
      series={[{ name: "value", color: "#002b5c", label: "No. Students" }]}
      withLegend
      tooltipProps={{ cursor: { fill: "none" }, position: { x: 100, y: 0 } }}
      legendProps={{ verticalAlign: "bottom", width: 60 }}
      withYAxis
    />
  );
}

export default Histogram;
