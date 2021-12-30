import React from 'react';
import classNames from 'classnames';

const TabItem = ({id, title, icon, active = false, onClick }) => {
    const handleClick = (ev) => {
        ev.preventDefault();
        onClick(id);
    }
    
    return (
        <li className="nav-item" key={id}>
            <a className={classNames({'nav-link': true, 'active': !!active})}
               onClick={handleClick}
               href="#">
                <span className="hide-xs">{title}</span>
                {!!icon && <span className={classNames(`bi-${icon}`)} /> }
            </a>
        </li>
    );
};

export default TabItem;
