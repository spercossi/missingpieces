import { Button } from "@material-tailwind/react";

export default function GreyButton({ children, type = "button", onClick, disabled, ...props }) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="!important: bg-[#90A4AE] !text-[#FFFFFF] font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-[#3C3C3C] disabled:opacity-50 disabled:cursor-not-allowed"
      data-ripple-light="true"
      {...props}
    >
      {children}
    </Button>
  );
}

