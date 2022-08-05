import React from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const textSelect = (props) => {

    const MenuProps={
        PaperProps:{
            style:{
                maxHeight:300,
            }
        }
    }

    let menu = null;
    // if item list exists in props
    if (props.items !== []) {
        // map item list into dropdown list
        menu = (
            <FormControl>
                <InputLabel
                    shrink
                >
                    {props.label}
                </InputLabel>
                <Select
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    error={props.error}
                    className={props.className}
                    MenuProps={MenuProps}
                >

                    {props.items.map(
                        (item, i) => {
                            return (
                                <MenuItem value={item} key={i}>{item}</MenuItem>
                            )
                        }
                    )}
                </Select>
            </FormControl>
        )
    }

    return (
        <div>
            {menu}
        </div>
    )
}

export default textSelect;