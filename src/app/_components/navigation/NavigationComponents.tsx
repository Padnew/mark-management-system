import { Tooltip } from "@mantine/core";
import {
  AiOutlineHome,
  AiOutlineLineChart,
  AiOutlineUpload,
} from "react-icons/ai";
import { PiStudentFill } from "react-icons/pi";

interface NavbarLinkProps {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  onClick?(): void;
  bottom?: boolean;
}

export const NavigationLinks = [
  { icon: AiOutlineHome, label: "Home", route: "/" },
  { icon: PiStudentFill, label: "Students", route: "/students" },
  { icon: AiOutlineLineChart, label: "Analytics", route: "/analytics" },
  { icon: AiOutlineUpload, label: "Upload", route: "/upload" },
];

export function NavbarLink({
  icon: Icon,
  label,
  onClick,
  bottom,
}: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right">
      <div
        onClick={onClick}
        style={{ marginBottom: "4rem" }}
        data-cy={`nav-button-${label.toLowerCase()}`}
      >
        <Icon size={40} />
      </div>
    </Tooltip>
  );
}
