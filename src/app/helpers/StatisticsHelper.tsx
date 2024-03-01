import { ChartData } from "@mantine/charts";
import { ClassType, Result } from "../types";

export function MakeHistogram(results: Result[]) {
  const histogram = {
    Fail: 0,
    Pass: 0,
    Third: 0,
    "Lower Second": 0,
    "Upper Second": 0,
    "First Class": 0,
  };

  results.forEach((result) => {
    const mark = result.mark;
    if (mark >= 70) histogram["First Class"]++;
    else if (mark >= 60) histogram["Upper Second"]++;
    else if (mark >= 50) histogram["Lower Second"]++;
    else if (mark >= 45) histogram["Third"]++;
    else if (mark >= 40) histogram["Pass"]++;
    else histogram["Fail"]++;
  });

  const chartData: ChartData = Object.keys(histogram).map((key) => ({
    label: key,
    value: histogram[key as keyof typeof histogram],
  }));

  return chartData;
}

interface YearlyAverages {
  [key: string]: { sum: number; num: number };
}

export function GetHistoricalAverages(results: Result[]) {
  const yearlyData: YearlyAverages = {};

  results.forEach((result) => {
    const { year, mark } = result;
    if (!yearlyData[year]) {
      yearlyData[year] = { sum: 0, num: 0 };
    }
    yearlyData[year].sum += mark;
    yearlyData[year].num += 1;
  });

  const chartData = Object.keys(yearlyData).map((year) => {
    const { sum, num } = yearlyData[year];
    const average = num > 0 ? sum / num : 0;
    return { label: year, value: average.toFixed(2) };
  });
  console.log(chartData);
  return chartData;
}
interface ClassAverage {
  [classKey: string]: {
    sum: number;
    count: number;
  };
}

export function CalculateClassAverages(results: Result[]) {
  const classAverages: ClassAverage = {};

  results.forEach((result) => {
    const classKey = result.class_code;

    if (!classAverages[classKey]) {
      classAverages[classKey] = { sum: 0, count: 0 };
    }

    classAverages[classKey].sum += result.mark;
    classAverages[classKey].count += 1;
  });

  const graphData = Object.keys(classAverages).map((classKey) => {
    const { sum, count } = classAverages[classKey];
    const average = count > 0 ? sum / count : 0;

    return {
      classKey,
      average: Number(average.toFixed(2)),
    };
  });

  return graphData;
}
