import React from 'react';
import Moment from 'moment';

import cnst from '../../utility/PostForm/constant';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typo from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button/';
import ExpPanel from '@material-ui/core/ExpansionPanel';
import ExpPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

const DATE_FORMAT = 'DD MMM';

const style = {
    card: {
        maxWidth: 400,
        minWidth: 320,
        margin: "auto",
        width: '100%',
    },

    rosterCode: {
        fontSize: 25,
    },

    expPanel: {
        width: '100%',
        margin: 0,
        boxShadow: 'none',
    },
}

const post = (props) => {
    const { classes } = props;
    // ------------------------ dynmaic display ------------------------
    let RosterCode = (groupKey) => {
        switch (props[groupKey].dutyType) {
            case cnst.SIM:
            case cnst.OTHERS:
                return (
                    <Typo variant='display1' align='center' className={classes.rosterCode}>
                        {props[groupKey].rosterCode}
                    </Typo>
                )

            case cnst.FLIGHT:
                if (groupKey === cnst.REQUEST) {
                    switch (props[groupKey].portRange) {
                        case cnst.PORTS:
                            return (
                                <Grid container justify='space-around'>
                                    {
                                        props[groupKey].flightCode.map(r => {
                                            return (
                                                <Typo variant='display1' align='center' className={classes.rosterCode} key={r}>{r}</Typo>
                                            )
                                        })
                                    }
                                </Grid >
                            )

                        case cnst.REGIONS:
                            return (
                                <Grid container justify='space-around'>
                                    {
                                        props[groupKey].regionCode.map(r => {
                                            return (
                                                <Typo variant='display1' align='center' className={classes.rosterCode} key={r}>{r}</Typo>
                                            )
                                        })
                                    }
                                </Grid >
                            )

                        default:
                            return;
                    }
                } else {
                    return (
                        <Grid container justify='space-around'>
                            {
                                props[groupKey].flightCode.map(r => {
                                    return (
                                        <Typo variant='display1' align='center' className={classes.rosterCode} key={r}>{r}</Typo>
                                    )
                                })
                            }
                        </Grid >
                    )
                }

            case cnst.GDAY:
                return (
                    <Typo variant='display1' align='center' className={classes.rosterCode}>
                        G Day
                    </Typo>
                )

            case cnst.RESERVE:
                return (
                    <Typo variant='display1' align='center' className={classes.rosterCode}>
                        RESERVE
                    </Typo>
                )

            default:
                return;
        }
    }
    // ------------------------ /dynmaic display ------------------------

    return (
        <Card className={classes.card}>
            <CardContent>

                <Grid container justify='flex-start' direction='column'>
                    {/* Main body */}
                    <Grid container direction='column' justify='flex-start' alignItems='center'>
                        {/* Roster Code*/}
                        <Grid container direction='row' justify='space-between' alignItems='center'>
                            {/* Offer */}
                            <Grid xs={4} item container justify='center'>
                                {RosterCode(cnst.OFFER)}
                            </Grid>

                            {/* Request */}
                            <Grid xs={6} item container justify='center'>
                                {(props.offer.offerType === cnst.PROFFER) ? null :
                                    RosterCode(cnst.REQUEST)
                                }
                            </Grid>
                        </Grid>

                        {/* Details */}
                        <Grid container direction='row' justify='space-between' alignItems='flex-start'>

                            {/* Offer */}
                            <Grid item xs={4} container direction='column'>
                                {/* Aircraft Type */}
                                {!(cnst.PLANE_TYPE in props.offer) ? null :
                                    <Typo variant='body2' align='center'>{props.offer.planeType}</Typo>
                                }
                                {/* Duty details */}
                                <Grid container justify='center' direction='row'>
                                    <Grid item>
                                        <Typo variant='body1' align='center'>{showDate(props.offer.startDate, props.offer.endDate)}</Typo>
                                        {!(cnst.SIGN_ON_TIME in props.offer) ? null :
                                            <Typo variant='body2' align='left'>{props.offer.signOnTime}L</Typo>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* middle */}
                            <Grid item xs={2} container justify='center' direction='column'>
                                {(props.offer.offerType === cnst.PROFFER) ? null :
                                    <Typo variant='subheading' align='center'>{props.offer.offerType}</Typo>
                                }
                            </Grid>

                            {/* Request */}
                            <Grid item xs={6} container direction='column'>
                                {(props.offer.offerType === cnst.PROFFER) ?
                                    <Typo variant='subheading' align='center'>{props.offer.offerType}</Typo>
                                    :
                                    <div>
                                        {!(cnst.PLANE_TYPE in props.request) ? null :
                                            <Typo variant='body2' align='center'>{props.request.planeType.join('/')}</Typo>
                                        }
                                        <Typo variant='body1' align='center'>{showDate(props.request.startDate, props.request.endDate)}</Typo>
                                    </div>
                                }
                            </Grid>

                        </Grid>
                    </Grid>

                    {/* Remark */}
                    <Divider variant='middle' className={classes.divider} />
                    <Grid container direction='row' justify='center'>
                        <Typo variant='body2'>{props.remark}</Typo>
                    </Grid>

                    {/* User panel */}
                    {props.isAuth ?
                        <ExpPanel className={classes.expPanel}>
                            <ExpPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid container direction='row' justify='space-between' alignItems='flex-start'>
                                    <Typo variant='caption'>{props.pub_date}</Typo>
                                    <Typo variant='caption'><strong>{props.username}</strong></Typo>
                                </Grid>
                            </ExpPanelSummary>

                            <ExpPanelDetails>
                                {/* Footer: if posted by current user, display user functions, else display contact method */}
                                {(props.postedByMe) ?
                                    <Grid container direction='row' justify='center'>
                                        <Button onClick={props.onDelete}>Delete post</Button>
                                    </Grid>
                                    :
                                    <Grid container direction='column' justify='flex-start' alignItems='flex-start'>
                                        <Typo variant='body2'>{props.username} ({props.rosterName})</Typo>
                                        <Typo variant='caption'>Contact:</Typo>
                                        <Grid container direction='row' justify='center' alignItems='baseline'>
                                            <Button color='primary' href={'https://m.me/' + props.fbUserName} target='_blank' disabled={typeof (props.fbUserName) === 'undefined' || props.fbUserName === ''}>Facebook</Button>
                                            <Button color='primary' href={'mailto:' + props.email} target='_blank' disabled={typeof (props.email) === 'undefined' || props.email === ''}>Email</Button>
                                            <Button color='primary' href={'https://wa.me/' + props.mobile} target='_blank' disabled={typeof (props.mobile) === 'undefined' || props.mobile === ''}>Whatsapp</Button>
                                        </Grid>
                                    </Grid>
                                }
                            </ExpPanelDetails>
                        </ExpPanel>
                        :
                        <div>
                            <Divider variant='middle' className={classes.divider} />
                            <Typo variant='caption' align='center'>{props.pub_date}</Typo>
                            <Typo variant='caption' align='center'>login to see contact details</Typo>
                        </div>
                    }

                </Grid>

            </CardContent>
        </Card >
    )
};

export default withStyles(style)(post);

// process the date for display

const showDate = (dStart, dEnd) => {
    let output = '';
    // if same date, then show only one date
    if (dStart === dEnd) {
        output = Moment(dStart).format(DATE_FORMAT)
    } else {
        output = Moment(dStart).format(DATE_FORMAT) + '-' + Moment(dEnd).format(DATE_FORMAT)
    }

    return (output)
}