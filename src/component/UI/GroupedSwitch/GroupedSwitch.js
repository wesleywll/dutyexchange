import React, { Component } from 'react';

import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typo from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import { withStyles } from '@material-ui/core';

const styles = theme => ({
    root: {
        maxWidth: 200,
        minWidth: 100,
        borderRadius: 0,
        borderBottom: '1px solid #949494',
        boxShadow: 'none',
    }
})

class groupedSwitch extends Component {
    state = {
        choice: this.props.choice,
    }

    componentWillUpdate() {
        // before showing menu,
        // check if choice has changed, if so, set state to store's choice
        if (!this.props.showMenu && this.state.choice !== this.props.choice) {
            this.setState({ choice: this.props.choice })
        }
    }

    // set choice for given group
    onChipClick = (group, item) => {
        const newChoice = {
            ...this.state.choice,
            [group]: item,
        }
        this.setState({ choice: newChoice })
    }

    //--------------- Menu handlers -------------
    // Menu close, reset selected to original input from parent
    onMenuClose = () => {
        this.props.onMenuClose();
        this.setState({
            choice: this.props.choice,
        })
    }

    //selection confirmed, output selected list to parent
    onSelectionConfirm = () => {
        this.props.onSelectionChanged(this.state.choice)
        this.setState({ showMenu: false })
    }
    //--------------- /Menu handlers -------------
    render() {
        // show list of item for selection menu as chip
        const _menuItemChipList = (group, itemList) => {
            return (
                itemList.map(item => {
                    return (
                        <Chip
                            key={item}
                            label={item}
                            onClick={() => this.onChipClick(group, item)}
                            color={this.state.choice[group] === item ? 'primary' : 'default'}
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
                            {_menuItemChipList(group, groupedItemList[group])}
                        </div>
                    )
                })
            )
        }

        return (
            <div>
                {/* Selection Menu */}
                <Dialog
                    open={this.props.showMenu}
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
            </div>
        )
    }
}

export default withStyles(styles)(groupedSwitch);