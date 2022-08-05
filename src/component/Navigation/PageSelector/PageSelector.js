import React from 'react';

import css from './PageSelector.css'

const pageSelector = () => {

    return (
        <div className={css.PageSelector}>
            <item>First</item>
            <item>{"<<"}</item>
            <item>{">>"}</item>
            <item>Last</item>
        </div>
    )
}

export default pageSelector;