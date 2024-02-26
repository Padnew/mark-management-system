import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core";
import Link from "next/link";
import React, { MouseEventHandler } from "react";
import { FaEye } from "react-icons/fa";

interface ButtonProps extends ActionIconProps {
  icon?: JSX.Element;
  label: string;
  path?: string;
  onclick: MouseEventHandler<HTMLAnchorElement>;
}

export const EditButton = ({
  path,
  icon,
  label,
  onclick,
  ...props
}: ButtonProps) => {
  return (
    <Tooltip position="top-end" label={label}>
      <ActionIcon
        component={Link}
        href={path ?? ""}
        {...props}
        onClick={onclick}
      >
        {icon ? icon : <FaEye />}
      </ActionIcon>
    </Tooltip>
  );
};
