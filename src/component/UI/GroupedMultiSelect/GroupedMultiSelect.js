import React, { Component } from 'react';

import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typo from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import ChangeSelectIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    root: {
        maxWidth: 200,
        minWidth: 100,
        borderRadius: 0,
        borderBottom: '1px solid #949494',
        boxShadow: 'none',
    },
    top:{
        marginTop: 10,
    }
})

class groupedMultiSelect extends Component {
    state = {
        showMenu: false,
        singleSelection: this.props.singleSelection,
        selected: [],
    }

    // toggle selection for clicked item, if singleSelection mode is active, select only one item
    onChipClick = (item) => {
        if (!this.state.selected.includes(item)) {
            if (this.state.singleSelection) {
                this.setState({ selected: [item] });
            } else {
                this.setState({ selected: [...this.state.selected, item] })
            }
        } else {
            this._deleteItem(item)
        }
    }

    // delete item from selected list
    _deleteItem = (item) => {
        // copy selected item list
        let newList = [...this.state.selected];
        // remove item from list
        newList.splice(newList.indexOf(item), 1);
        this.setState({ selected: newList })
    }

    // handle delete order
    onDelete = (item) => {
        // copy selected item list
        let newList = [...this.state.selected];
        // remove item from list
        newList.splice(newList.indexOf(item), 1);

        // output to parent
        this.props.onSelectionChanged(newList)
        this.setState({ selected: newList })
    }

    //--------------- Menu handlers -------------
    // Menu close, reset selected to original input from parent
    onMenuClose = () => {
        this.setState({
            selected: this.props.selectedItems,
            showMenu: false
        })
    }

    //selection confirmed, output selected list to parent
    onSelectionConfirm = () => {
        this.props.onSelectionChanged(this.state.selected)
        this.setState({ showMenu: false })
    }
    //--------------- /Menu handlers -------------

    render() {
        const { classes } = this.props;

        // show list of selected items as chips
        const selectedItemChipList = (itemList) => {
            return (
                itemList.map(item => {
                    return (
                        <Chip
                            key={item}
                            label={item}
                            onDelete={item === 'Any' ? null : () => this.onDelete(item)}
                        />
                    )
                })
            )
        }

        // show list of item for selection menu as chip
        const menuItemChipList = (itemList) => {
            return (
                itemList.map(item => {
                    return (
                        <Chip
                            key={item}
                            label={item}
                            onClick={() => this.onChipClick(item)}
                            color={this.state.selected.includes(item) ? 'primary' : 'default'}
                        />
                    )
                })
            )
        }

        // show grouped item list
        const groupedItemChipList = (groupedItemList) => {
            const groups = Object.keys(groupedItemList);
            return (
                groups.map(group => {
                    return (
                        <div key={group}>
                            <Typo variant='caption'>{group}</Typo>
                            {menuItemChipList(groupedItemList[group])}
                        </div>
                    )
                })
            )
        }

        return (
            <div className={classes.top}>
                {/* Selection Menu */}
                <Dialog
                    open={this.state.showMenu}
                    onClose={this.onMenuClose}
                >
                    <DialogContent>
                        {groupedItemChipList(this.props.groupedItemList)}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onMenuClose}>Cancel</Button>
                        <Button onClick={this.onSelectionConfirm}>OK</Button>
                    </DialogActions>
                </Dialog>

                <Paper
                    className={classes.root}
                    onClick={() => { this.setState({ showMenu: true }) }}
                >
                    {/* Main field */}
                    <Grid container direction='row' justify='space-around' alignItems='center'>
                        <Grid item xs={9} container direction='row' justify='flex-start'>
                            {selectedItemChipList(this.props.selectedItems)}
                        </Grid>
                        <ChangeSelectIcon />
                    </Grid>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(groupedMultiSelect);