import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import DateTimePicker from 'react-datetime-picker';

// Components
import Slot from '../components/Slot';
import CreateSlot from '../components/CreateSlot';

// Mui
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Redux
import { connect } from 'react-redux';
import { 
    getCustomPost, 
    clearPost, 
    getSlots, 
    clearSlots, 
    setDayNumber,
    loadData
} from '../redux/actions/dataActions';

const styles = {
    backButton: {
        marginTop: '10px',
    },
    loadingContainer: {
        marginTop: 20,
        height: 100,
        width: 'auto',
        textAlign: 'center',
    },
    loadingIndicator: {
      position: 'relative',
      top: '20px',
    },
    noSlots: {
        marginTop: 20,
        textAlign: 'center'
    },
    dateHeader: {
        marginTop: 10,
        textAlign: 'center'
    },
    dateTimePicker: {
        marginTop: 10
    },
    dateTimeTitle: {
        marginTop: 10
    },
    dateButtonContainer: {
        marginTop: 10,
    },
    dateButton: {
        color: '#228B22'
    },
    addButton: {
        textAlign: 'center',
        marginTop: 20
    },
    noSlotsContainer: {
        textAlign: 'center'
    }
}

class customSchedulePage extends Component {
    state = {
        pickerDate: null,
        isDate: false,
        currentDate: null
    };
    componentDidMount() {
        const postId = this.props.match.params.postId;
        this.props.loadData();
        var today = new Date();
        today = (today.toDateString())
        this.setState({
            currentDate: today
        })
        this.props.getCustomPost(postId, this.props.history);
        const millisecondsPerDay = 86400000;
        var offset = new Date().getTimezoneOffset()
        var offset = new Date()
        offset = offset.getTimezoneOffset() * 60000;
        var timeStamp = Date.now() - offset;
        var dayNumber = Math.floor(timeStamp/millisecondsPerDay);
        this.props.getSlots(postId, dayNumber, true)
    }
    componentWillUnmount(){
        this.props.clearSlots();
        this.props.setDayNumber(null);
        this.props.clearPost();
    }
    onChange = date => {
        if (date){
            this.setState({ 
                pickerDate: date,
                isDate: true
            })
        }
        else {
            this.setState({ 
                pickerDate: date,
                isDate: false
            })
        }
        
    }
    handleDateChange = (event) => {
        const millisecondsPerDay = 86400000;
        var timeStamp = this.state.pickerDate;
        var currentDate = (timeStamp.toDateString())
        this.setState({
            currentDate: currentDate
        })
        var dayNumber = Math.floor(timeStamp/millisecondsPerDay)
        this.props.getSlots(this.props.data.post.postId, dayNumber, true)
    }
    render() {
        const { classes, data: { post, loading, currentSlots: { slots }, dayNumber }} = this.props
        const { pickerDate, isDate, currentDate } = this.state
        let scheduleMarkup = !loading ? (
            (slots && slots.length > 0) ? (
                slots.map((slots) => <Slot thisSlot={slots} isCustom={true} key={slots.slotId}/>)    
            ) : (
                <div className={classes.noSlotsContainer}>
                    <Typography variant='body1' className={classes.noSlots}>
                        No slots currently for this day
                    </Typography>
                </div>
                
            )
          ) : (
            <div className={classes.loadingContainer}>
                <CircularProgress size={50} className={classes.loadingIndicator}/>                
            </div>
          );
        let customDatePicker = !loading ? (
            <Fragment>
                <Typography variant='h6' className={classes.dateTimeTitle}>
                    Select date
                </Typography>
                <DateTimePicker
                onChange={this.onChange}
                value={this.state.pickerDate}
                className={classes.dateTimePicker}
                format="yyyy-MM-dd"	
                />
                </Fragment>
        ) : (
            <div/>
        )
        return (            
            <Grid container spacing={3}>
            <Grid item xs={3}>
                {!loading && (
                    <Button 
                    component={Link} 
                    to={`/schedule/${post.postId}`}
                    className={classes.backButton} 
                    variant='outlined' 
                    color='inherit'
                    >
                        Back
                    </Button>
                )}
            </Grid>   
            <Grid item xs={6} sm={6}>
                <Typography variant='h5' className={classes.dateHeader}>
                    {currentDate}
                </Typography>
                {scheduleMarkup}
                {!loading && (
                    <div className={classes.addButton}>
                        <CreateSlot isCustom={true}/>
                    </div>
                )}
            </Grid>
            <Grid item xs={3}>
                {customDatePicker}
                {(isDate && !loading) && (
                    <div className={classes.dateButtonContainer}>
                        <Button 
                        variant='outlined' 
                        className={classes.dateButton} 
                        size='small'
                        onClick={this.handleDateChange}
                        >
                            Go to date
                        </Button>
                    </div>
                )}
            </Grid>
        </Grid>
        );
    }
}

customSchedulePage.propTypes = {
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

const mapActionsToProps = {
    getCustomPost,
    clearPost,
    getSlots,
    clearSlots,
    setDayNumber,
    loadData,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(customSchedulePage));