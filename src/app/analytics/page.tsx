"use client";
import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../_components/shared/PageHeader";
import { ClassType, Result } from "../types";
import UserContext from "../context/UserContext";
import {
  Button,
  Center,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import Histogram from "../_components/analytics/Histogram";
import {
  CalculateClassAverages,
  GetHistoricalAverages,
  MakeHistogram,
} from "../helpers/StatisticsHelper";
import { PiRepeatOnceBold } from "react-icons/pi";
import { AreaChart, BarChart } from "@mantine/charts";

async function getAllClasses(
  user_id: number,
  role: number
): Promise<ClassType[]> {
  const res =
    role == 1
      ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/`)
      : await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/classes/user/${user_id}`
        );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
export default function Page() {
  const userContext = useContext(UserContext);
  const [studentResults, setStudentResults] = useState<Result[] | undefined>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [loadingGraphData, setLoadingGraphData] = useState(false);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [validLecturer, setValidLecturer] = useState(false);
  const router = useRouter();
  if (!userContext?.isLoadingUser && !userContext?.user) {
    router.push("/404");
  }
  const isAdmin = userContext?.user?.role === 1;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (userContext?.user) {
        try {
          const data = await getAllClasses(
            userContext?.user.user_id,
            userContext?.user.role
          );
          setClasses(data);
          if (
            (data.length > 0 && userContext.user.role === 2) ||
            userContext.user.role === 1
          ) {
            setValidLecturer(true);
          }
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      }
    };

    if (userContext && !userContext.isLoadingUser) {
      fetchData();
      setLoading(false);
    }
  }, [userContext, userContext?.user, userContext?.isLoadingUser]);

  const generateGraphs = async () => {
    setStudentResults([]);
    setLoadingGraphData(true);

    const queries = {
      class: selectedClass !== "All" ? selectedClass : undefined,
      course: selectedCourse !== "All" ? selectedCourse : undefined,
      degreeLevel:
        selectedDegreeLevel !== "All" ? selectedDegreeLevel : undefined,
      year: selectedYear !== "All" ? selectedYear : undefined,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/results/queried`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queries),
        }
      );

      if (response.status == 404) {
      } else {
        const data = await response.json();
        setStudentResults(data);
      }
    } catch (error) {
      console.error("Error fetching graphs:", error);
    } finally {
      setLoadingGraphData(false);
    }
  };

  function resetFilters() {
    isAdmin && setSelectedClass("All");
    setSelectedCourse("All");
    setSelectedDegreeLevel("All");
    setSelectedYear("All");
  }

  const data = studentResults!.map((result) => ({
    classCode: result.class_code,
    reg: result.reg_number,
    result: result.mark,
    year: result.year,
  }));

  const singleYearAverage =
    data.length > 0
      ? data.reduce((total, next) => total + next.result, 0) / data.length
      : 0;
  const courseSelectData = [
    { value: "Computer Science", label: "Computer Science" },
    {
      value: "Software Engineering",
      label: "Software Engineering",
    },
    {
      value: "Electrical Engineering",
      label: "Electrical Engineering",
    },
    {
      value: "Mathematics",
      label: "Mathematics",
    },
    {
      value: "Statistics",
      label: "Statistics",
    },
  ];
  return (
    <>
      <PageHeader
        heading={"Analytics"}
        subHeading={"Insights into student performance"}
      />
      <LoadingOverlay
        visible={loading || loadingGraphData}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Paper px={5} bg="transparent" pl="lg">
        <Grid ml={5}>
          <Grid.Col span={5}>
            <Select
              data={[
                ...(isAdmin ? [{ value: "All", label: "All" }] : []),
                ...(Array.isArray(classes)
                  ? classes.map((classType) => ({
                      value: classType.class_code.toString(),
                      label: `${classType.class_code}: ${classType.class_name}`,
                    }))
                  : []),
              ]}
              placeholder="Filter by class"
              label="Class"
              size="md"
              value={selectedClass}
              onChange={(value) => setSelectedClass(value!)}
              disabled={!validLecturer}
            />
          </Grid.Col>
          <Grid.Col span={5}>
            <Select
              data={[
                ...(isAdmin ? [{ value: "All", label: "All" }] : []),
                ...courseSelectData,
              ]}
              placeholder="Filter by course"
              label="Course"
              size="md"
              value={selectedCourse}
              onChange={(value) => setSelectedCourse(value!)}
              disabled={!validLecturer}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Center py="lg" pb={0} mb={0}>
              <Button
                variant="filled"
                size="lg"
                color="green"
                onClick={generateGraphs}
                fullWidth
                mx="lg"
                disabled={!validLecturer}
              >
                Generate Graphs
              </Button>
            </Center>
          </Grid.Col>
        </Grid>
        <Grid ml={5}>
          <Grid.Col span={5}>
            <Stack gap={0}>
              <Text>Degree Level</Text>
              <SegmentedControl
                radius="md"
                size="sm"
                color="#002b5c"
                data={["All", "BSc", "MSc", "PHD"]}
                value={selectedDegreeLevel}
                defaultChecked
                onChange={(value) => setSelectedDegreeLevel(value)}
                disabled={!validLecturer}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={5}>
            <Stack gap={0}>
              <Text>Year</Text>
              <SegmentedControl
                radius="md"
                color="#002b5c"
                size="sm"
                data={["All", "2020", "2021", "2022", "2023", "2024"]}
                onChange={(value) => setSelectedYear(value)}
                value={selectedYear}
                disabled={!validLecturer}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            <Center py="lg" pb={0} mb={0}>
              <Button
                variant="outline"
                size="lg"
                color="red"
                onClick={resetFilters}
                fullWidth
                mx="lg"
                disabled={!validLecturer}
              >
                Clear Filters
              </Button>
            </Center>
          </Grid.Col>
        </Grid>
      </Paper>
      <Center>
        {validLecturer ? (
          <>
            {studentResults && studentResults?.length == 0 && (
              <Title order={2} c="red">
                No results for those parameters
              </Title>
            )}
            {studentResults && studentResults?.length > 0 && (
              <Stack ta="center">
                <Text>{`Results used in data: ${studentResults?.length}`}</Text>
                <SimpleGrid cols={2}>
                  <Group>
                    <Stack>
                      <Title order={4}>Outcomes of students</Title>
                      <Histogram results={studentResults} />
                    </Stack>
                    <Flex>
                      <PiRepeatOnceBold />
                      {studentResults.reduce((acc, value) => {
                        return (acc = acc > value.mark ? acc : value.mark);
                      }, 0)}
                    </Flex>
                  </Group>
                  {selectedYear == "All" && (
                    <Stack>
                      <Title order={4}>Average across each year</Title>
                      <AreaChart
                        w={650}
                        h={450}
                        curveType="linear"
                        data={GetHistoricalAverages(studentResults)}
                        series={[
                          {
                            name: "value",
                            color: "#002b5c",
                            label: "Average %",
                          },
                        ]}
                        dataKey={"label"}
                      />
                    </Stack>
                  )}
                  {selectedYear != "All" && selectedClass == "All" && (
                    <>
                      <Stack>
                        <Title order={4}>
                          Average across each class for {selectedYear}
                        </Title>
                        <AreaChart
                          w={650}
                          h={450}
                          curveType="linear"
                          data={CalculateClassAverages(studentResults)}
                          series={[
                            {
                              name: "average",
                              color: "#002b5c",
                              label: "Average %",
                            },
                          ]}
                          dataKey={"classKey"}
                        />
                      </Stack>
                    </>
                  )}
                  {selectedYear != "All" && selectedClass != "All" && (
                    <Stack>
                      <Title order={4}>
                        Student marks for {selectedClass} in {selectedYear}
                      </Title>
                      <BarChart
                        w={650}
                        h={450}
                        data={studentResults.sort((a, b) =>
                          a.mark > b.mark ? 1 : 0
                        )}
                        dataKey="reg_number"
                        series={[
                          { name: "mark", color: "#002b5c", label: "Result" },
                        ]}
                        tooltipProps={{
                          cursor: { fill: "none" },
                          position: { x: 700, y: 0 },
                        }}
                        withXAxis={false}
                      />
                    </Stack>
                  )}
                </SimpleGrid>
              </Stack>
            )}
          </>
        ) : (
          <Stack align="center">
            <Title order={2} c="red">
              You must upload marks before viewing analytics
            </Title>
            <Button
              onClick={() => router.push("/upload")}
              w="fit-content"
              size="xl"
              variant="outline"
              color="red"
            >
              Upload Marks
            </Button>
          </Stack>
        )}
      </Center>
    </>
  );
}
