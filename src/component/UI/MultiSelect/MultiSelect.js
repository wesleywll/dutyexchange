import React from 'react';

import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import cnst from '../../../utility/PostForm/constant';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            maxWidth: 50,
        }
    }
}

const multiSelect = (props) => {

    return (
        <FormControl>
            <InputLabel
                shrink>
                {props.label}
            </InputLabel>
            <Select
                multiple
                value={props.value}
                renderValue={
                    selected => (
                        <div className={props.className}>
                            {selected.map(value => {
                                return (
                                    <Chip
                                        key={value}
                                        label={value}
                                        onDelete={value === cnst.ANY ? null : () => props.onDelete(value)}
                                    />)
                            }
                            )}
                        </div>
                    )}
                onChange={props.onChange}
                error={props.error}
                MenuProps={MenuProps}
            >
                {props.items.map(item => (
                    <MenuItem
                        key={item}
                        value={item}
                        style={{ width: 50 }}
                    >
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default multiSelect;