// A fixed button on top layer for adding new post

import React from 'react';

import css from './AddBtn.css';

const addBtn=(props)=>{
    let button= null;
    //if set to show in props, define button 
    if (props.show){
        button=(
            // fire click handler on click
            <button className={css.AddBtn}
                onClick={props.onClick}>+</button>
        )
    }

    return(
        <div>
            {button}
        </div>
    )
}

export default addBtn;