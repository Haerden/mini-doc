import React from 'react';
import classnames from 'classnames';
// import './TabList.scss'

const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab}) => {
    return (
        <ul className="nav nav-pills tablist-component">
            {files.map(file => {
                const fClassName = classnames({
                    'nav-link': true,
                    'active': file.id === activeId
                });
            
                return (
                    <li className="nav-item" key={file.id}>
                      <a 
                        href="#"
                        className={fClassName}
                        onClick={(e) => {e.preventDefault(); onTabClick(file.id)}}
                      >
                        {file.title}
                      </a>
                    </li>
                )
            })}
        </ul>
    );
};

export default TabList;