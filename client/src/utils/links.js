import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const links = [
  { id: 1, text: "stats", path: "/", icon: <IoBarChartSharp /> },
  { id: 2, text: "show all", path: "all-spending", icon: <MdQueryStats /> },
  { id: 3, text: "add new", path: "add-spending", icon: <FaWpforms /> },
  { id: 4, text: "profile", path: "profile", icon: <CgProfile /> },
];

export default links;
