import { ChartData } from "@mantine/charts";
import { Result } from "../types";

export function MakeHistogram(results: Result[]) {
  //The chart data format
  const histogram = {
    Fail: 0,
    Pass: 0,
    Third: 0,
    "Lower Second": 0,
    "Upper Second": 0,
    "First Class": 0,
  };

  //For each result it will check the mark and depending on what value it will increment the count
  results.forEach((result) => {
    const mark = result.mark;
    if (mark >= 70) histogram["First Class"]++;
    else if (mark >= 60) histogram["Upper Second"]++;
    else if (mark >= 50) histogram["Lower Second"]++;
    else if (mark >= 45) histogram["Third"]++;
    else if (mark >= 40) histogram["Pass"]++;
    else histogram["Fail"]++;
  });
  //Format the data for the chart by iterating over the histogram and assigning a label (i.e First class) and the value of that associated key
  const chartData: ChartData = Object.keys(histogram).map((key) => ({
    label: key,
    value: histogram[key as keyof typeof histogram], //This reads as the value of the data is the value in the place of the key from type histogram
  }));

  return chartData;
}

//Dictionary type for formatting the data as a chart
interface YearlyAverages {
  [key: string]: { sum: number; num: number };
}

export function GetHistoricalAverages(results: Result[]) {
  const yearlyData: YearlyAverages = {};
  results.forEach((result) => {
    //Checks if there is already results in the current results year
    const { year, mark } = result;
    if (!yearlyData[year]) {
      yearlyData[year] = { sum: 0, num: 0 };
    }
    //Add the total mark to that years running sum
    yearlyData[year].sum += mark;
    //Increment the number of marks
    yearlyData[year].num += 1;
  });

  //Create the data format from iterating over the keys
  const chartData = Object.keys(yearlyData).map((year) => {
    //Destructure each entry
    const { sum, num } = yearlyData[year];
    //If there are values then calculate the average
    const average = num > 0 ? sum / num : 0;
    return { label: year, value: average.toFixed(2) };
  });
  return chartData;
}
interface ClassAverage {
  [classKey: string]: {
    sum: number;
    count: number;
  };
}
/*
Purpose: To take in a list of results and creates the average for each year
Parameters: List of results to average out
*/
export function CalculateClassAverages(results: Result[]) {
  const classAverages: ClassAverage = {};

  results.forEach((result) => {
    //Check if the class code already exists, if not then create it
    const classKey = result.class_code;
    if (!classAverages[classKey]) {
      classAverages[classKey] = { sum: 0, count: 0 };
    }

    //Add sum of total marks for that class
    classAverages[classKey].sum += result.mark;
    //Add up the amount of marks found for that class
    classAverages[classKey].count += 1;
  });

  //Create the array from the keys of the dictionary
  const chartData = Object.keys(classAverages).map((classKey) => {
    //For each entry if there is a mark for the class then calculate the average
    const { sum, count } = classAverages[classKey];
    const average = count > 0 ? sum / count : 0;

    //Adds the class code and the average of that class code to the array
    return {
      classKey,
      average: Number(average.toFixed(2)),
    };
  });

  return chartData;
}
