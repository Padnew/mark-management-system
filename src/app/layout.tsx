import "@mantine/core/styles.css";
import "./globals.css";
import Navbar from "./_components/navigation/Navbar";
import { MantineProvider } from "@mantine/core";
import UserProvider from "./context/UserProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mark Mangement System",
  description: "Modify, manage and analyise student marks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <UserProvider>
            <div style={{ marginLeft: "4rem" }}>
              {children}
              <Navbar />
            </div>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
