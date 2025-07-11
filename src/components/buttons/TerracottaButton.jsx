import { Button } from "@material-tailwind/react";

export default function TerracottaButton({ children, type = "button", onClick, disabled, ...props }) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="!important: bg-[#D27D7D] !text-[#FFFFFF] hover:bg-[#b05858] border border-[#B8B3B3] font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      data-ripple-light="true"
      {...props}
    >
      {children}
    </Button>
  );
}