import React from 'react';

import css from './Backdrop.css';

const backdrop = (props) => {
    // display empty backdrop when show is set to true
    let backdrop = null;
    if (props.show) {
        backdrop = (
            <div className={css.Backdrop}></div>
        )
    }

    return (
        <div>
            {backdrop}
        </div>
    )
}

export default backdrop;