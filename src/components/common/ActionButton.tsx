import React from "react";
import { SxProps } from "@mui/material";
import { StyledActionButton } from "./common-components.styles";

interface ActionButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onClick?: () => void;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps;
  type?: "button" | "submit" | "reset";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant = "contained",
  color = "success",
  onClick,
  disabled = false,
  startIcon,
  endIcon,
  children,
  sx,
  type = "button",
}) => {
  return (
    <StyledActionButton
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={sx}
      type={type}
    >
      {children}
    </StyledActionButton>
  );
};

export default ActionButton;
