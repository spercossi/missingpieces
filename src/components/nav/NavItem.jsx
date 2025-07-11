import React from "react";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const NavItem = ({ to, icon: Icon, children, vertical }) => (
  <Typography
    as="li"
    variant="small"
    className={`flex ${vertical ? "flex-col text-l" : " gap-x-2"} p-1 font-medium`}
  >
    <Link to={to} className={`flex ${vertical ? "flex-col gap-y-2" : "items-center gap-x-2"}`}>
      {Icon && (
        <span className={vertical ? "flex items-center justify-center w-12 h-12" : ""}>
          <Icon className="w-10 h-10" />
        </span>
      )}
      {children}
    </Link>
  </Typography>
);
export default NavItem;