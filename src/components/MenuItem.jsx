import "./MenuItem.css";
import CodeIcon from "../assets/svgs/CodeIcon.svg?react";
import DecodeIcon from "../assets/svgs/DecodeIcon.svg?react";
import InfoIcon from "../assets/svgs/InfoIcon.svg?react";
import { Tooltip } from "react-tooltip";

export default function MenuItem(props) {
  const IconLibrary = {
    Code: CodeIcon,
    Decode: DecodeIcon,
    Info: InfoIcon,
  };

  const {
    iconName,
    title,
    description,
    isActive,
    onClick,
    onHoverSound,
    isNavbar = false,
  } = props;

  const handleMouseEnter = () => {
    if (onHoverSound) {
      onHoverSound();
    }
  };

  const tooltipId = `tooltip-${iconName}`;

  const IconComponent = IconLibrary[iconName];
  return (
    <>
      <div
        className={`menu-item ${isActive ? "clicked" : ""}`}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        data-tooltip-id={tooltipId}
        data-tooltip-content={description}
        data-tooltip-place="bottom"
      >
        <div className="menu-icon-wrapper">
          {IconComponent && (
            <IconComponent src={IconComponent} className="menu-icon" />
          )}{" "}
        </div>
        <h3 className="menu-title">{title}</h3>
        <p className="menu-description">{description}</p>
      </div>
      {isNavbar && (
        <Tooltip
          id={tooltipId}
          className="navbar-tooltip"
          delayShow={300}
          place="bottom"
        />
      )}
    </>
  );
}
