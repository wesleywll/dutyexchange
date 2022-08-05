import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../store/action/action_auth';

import Typo from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Ax from '../Ax/Ax';
import css from './Layout.css'
import cnst from '../../utility/PostForm/constant';
import Navbar from '../../component/Navigation/Navbar/Navbar'
import GroupedSwitch from '../../component/UI/GroupedSwitch/GroupedSwitch';


class Layout extends Component {
    state = {
        showFleetRankMenu: false,
    }

    onFleetRankMenuClicked = () => {
        this.setState({
            showFleetRankMenu: true,
        })
    }

    onFleetRankMenuClose = () => {
        this.setState({
            showFleetRankMenu: false,
        })
    }

    onFleetRankChanged = (choice) => {
        this.props.changeFleetDisplay(choice[cnst.FLEET]);
        this.props.changeRankDisplay(choice[cnst.RANK]);

        this.props.getServerData(choice[cnst.FLEET], choice[cnst.RANK], this.props.token);

        this.setState({
            showFleetRankMenu: false,
        })
    }

    onLogoutButtonClicked = () => {
        this.props.logout();
    }

    render() {
        const { match, location, history } = this.props;
        const fleetRankList = {
            [cnst.FLEET]: [cnst.FLEET_AIRBUS, cnst.FLEET_B777, cnst.FLEET_B747],
            [cnst.RANK]: [cnst.SO, cnst.FO, cnst.CN]
        }

        const fleetRankChoice = {
            [cnst.FLEET]: this.props.fleet_display,
            [cnst.RANK]: this.props.rank_display,
        }
        return (
            <Ax>
                <Navbar
                    onFleetRankMenuClicked={this.onFleetRankMenuClicked}
                    onLogoutButtonClicked={this.onLogoutButtonClicked}
                />
                <GroupedSwitch
                    showMenu={this.state.showFleetRankMenu}

                    onMenuClose={this.onFleetRankMenuClose}
                    onSelectionChanged={(choice) => { this.onFleetRankChanged(choice) }}

                    groupedItemList={fleetRankList}
                    choice={fleetRankChoice}
                />
                <main className={css.Main}>
                    {this.props.children}
                </main>

                <div className={css.Footer}>
                    <Divider variant='middle' />
                    <Typo variant='caption' align='center'>For support or feedback, contact: <a href={'mailto:dutyexchange@gmail.com'}>dutyexchange@gmail.com</a></Typo>
                </div>
            </Ax>
        )
    }
}

const stateToProps = (state) => {
    return {
        fleet_display: state.auth.fleet_display,
        rank_display: state.auth.rank_display,
        token: state.auth.token,
    }
}

const dispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout()),
        changeFleetDisplay: (fleet) => dispatch(actions.changeFleetDisplay(fleet)),
        changeRankDisplay: (rank) => dispatch(actions.changeRankDisplay(rank)),
        getServerData: (fleet, rank, token) => dispatch(actions.getServerData(fleet, rank, token)),

    }
}
export default withRouter(connect(stateToProps, dispatchToProps)(Layout));
