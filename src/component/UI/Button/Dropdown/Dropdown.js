import React from 'react';

import css from './Dropdown.css';

const textSelect = (props) => {
    let menu = null;
    // if item list exists in props
    if (props.items !== []) {
        // map item list into dropdown list
        menu = (
            <div className='dropdown-menu'>
                <select className={css.TextDropdown}>
                    {props.items.map(
                        (item,i) => {
                            return (
                                <a className="dropdown-item" key={i}>{item}</a>
                            )
                        }
                    )}
                </select>
            </div>
        )
    }

    return (
        <div className='dropdown'>
            <button type="button" className={`${css.TextDropdown} `+ props.style} data-toggle="dropdown">
                {props.text}
            </button>
            {menu}
        </div>
    )
}

export default textSelect;