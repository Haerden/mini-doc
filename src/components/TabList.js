import React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './TabList.scss';

const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {files.map((file) => {
        const withUnsavedMark = unsaveIds.includes(file.id);

        const fClassName = classnames({
          "nav-link": true,
          active: file.id === activeId,
          'withunsaved': withUnsavedMark
        });

        return (
          <li className="nav-item" key={file.id}>
            <a
              href="#"
              className={fClassName}
              onClick={(e) => {
                e.preventDefault();
                onTabClick(file.id);
              }}
            >
              {file.title}
              <span className="close-icon" onClick={(e) => {e.stopPropagation(); onCloseTab(file.id)}}>
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </span>
              {withUnsavedMark && (
                 <span className="rounded-circle unsaved-icon" onClick={(e) => {e.stopPropagation(); onCloseTab(file.id)}}>
               </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default TabList;
