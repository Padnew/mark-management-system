import { Result, Student } from "../types";

async function getStudentMarks(regNumbers: String[]): Promise<Result[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/results/regnumbers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regNumbers),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
//Purpose: To format and download any given list of students with their acommpanied marks
export async function exportStudentsToCSV(
  students: Student[],
  csvName: String
) {
  const regNumbers = students.map((student) => student.reg_number);
  const studentMarks = await getStudentMarks(regNumbers);
  //Gets each unique class code using a set
  const classes = Array.from(
    new Set(studentMarks.map((mark) => mark.class_code))
  );
  const headers =
    "reg_number, name, degree_name, degree_level, " + classes.join(", ") + "\n";
  let csvBody = headers;

  students.forEach((student) => {
    let studentRow = `${student.reg_number}, ${student.name}, ${student.degree_name}, ${student.degree_level}`;

    const marksString = classes
      .map((classCode) => {
        const mark = studentMarks.find(
          (mark) =>
            mark.reg_number === student.reg_number &&
            mark.class_code === classCode
        );
        return mark ? mark.mark : "N/A";
      })
      //Join is important for seperating each class mark with a value and comma
      .join(", ");

    //Combines the student info with their marks for each class
    csvBody += studentRow + ", " + marksString + "\n";
  });
  //Standard webapp practice for downloading a file for a user
  //Creating a blob of the data, attaching it to an a tag, clicking it then cleaning up the remaining link and URL
  const blob = new Blob([csvBody], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${csvName}.csv`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
