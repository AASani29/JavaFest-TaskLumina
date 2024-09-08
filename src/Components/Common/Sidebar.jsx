import "../CSS Files/Achievements.css";
import "../CSS Files/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faCalendarDays,
  faList,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import { FiClock, FiCalendar } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { SlBadge } from "react-icons/sl";
import { MdOutlineToday } from "react-icons/md";

import Logo from "../Assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to determine the class based on the current path
  const getButtonClass = (path) => {
    return location.pathname === path
      ? "sidebar-button-slected"
      : "sidebar-button";
  };

  return (
    <nav className="sidebar">
      <div className="logo-container" onClick={() => navigate("/dashboard")}>
        <img src={Logo} alt="Logo" className="logo1" />
      </div>
      <ul className="sidebar-features">
        <li>
          <div
            className={getButtonClass("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            <MdOutlineToday className="circle-icon" />
            <span>Today</span>
          </div>
        </li>
        <li>
          <div
            className={getButtonClass("/viewtodolist")}
            onClick={() => navigate("/viewtodolist")}
          >
            <FontAwesomeIcon icon={faList} className="circle-icon" />
            <span>View Todo List</span>
          </div>
        </li>
        <li>
          <div
            className={getButtonClass("/routine")}
            onClick={() => navigate("/routine")}
          >
            <FiClock className="circle-icon" />
            <span>Make Me a Routine</span>
          </div>
        </li>
        <li>
          <div
            className={getButtonClass("/scheduleanevent")}
            onClick={() => navigate("/scheduleanevent")}
          >
            <FiCalendar className="circle-icon" />
            <span>Schedule an Event</span>
          </div>
        </li>
        <li>
          <div
            className={getButtonClass("/achievements")}
            onClick={() => navigate("/achievements")}
          >
            <SlBadge className="circle-icon" />
            <span>View Achievements</span>
          </div>
        </li>
        <li>
          <div
            className={getButtonClass("/games")}
            onClick={() => navigate("/games")}
          >
            <IoGameControllerOutline className="circle-icon" />
            <span>Play a Game</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
