import React from 'react';
import PropTypes from 'prop-types';
import utils from 'react-schema-form';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = theme => ({
    form: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    schemaForm: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
    },
    bottomContainer: {
        flex: 1,
        marginTop: 8,
    },
    actionButtons: {
        '& > *': {
            marginLeft: theme.spacing(2),
        },
    },
    expandIcon: {
        transform: 'rotate(180deg)',
    },
});

class DeviceAutoAddDialog extends React.Component {

    componentDidMount() {
        const { initial } = this.props;
        if (initial.type) {
            this.handleTypeChange(initial.type, initial.config);
        }
    }

    componentDidUpdate(prevProps) {
        const { initial } = this.props;
        if (initial !== prevProps.initial) {
            this.handleTypeChange(initial.type, initial.config);
        }
    }

    handleTypeChange = (value, initial = {}) => {
        this.setState({ deviceType: value, model: initial });
    };

    onModelChange = (key, val) => {
        utils.selectOrSet(key, this.state.model, val);
    };

    toggleShowAdditional = e => {
        this.setState(prevState => ({
            additionalPropertiesOpen: !prevState.additionalPropertiesOpen,
        }));
    };

    handleCancel = () => {
        this.props.onClose();
    };

    handleSubmit = () => {
        const { initial, onAddDevice, onUpdateDevice } = this.props;
        const { deviceType, model: config } = this.state;

        if (initial.id) {
            onUpdateDevice(deviceType, config);
        } else {
            onAddDevice(deviceType, config);
        }

        this.props.onClose();
    };

    render() {
        const { classes, deviceTypes, open } = this.props;
        const { model, additionalPropertiesOpen, deviceType } = this.state;

        const currentSchema = {
            type: 'object',
            title: 'Configuration',
            properties: {},
            ...(deviceType ? deviceTypes[deviceType].schema : {}),
        };

        const requiredKeys = currentSchema.required;
        const optionalKeys = Object.keys(currentSchema.properties).filter(
            key => !(requiredKeys && requiredKeys.some(rk => key === rk))
        );
        const showAdditionalUi = optionalKeys.length > 0;

        return (
            <Dialog
                onClose={this.handleClose}
                className={classes.cardResponsive}
                aria-labelledby="form-dialog-title"
                disableBackdropClick
                open={open}
            >
                <DialogTitle id="form-dialog-title">Auto scan and add WLED Devices</DialogTitle>
                <DialogContent className={classes.cardResponsive}>
                    <DialogContentText>
                        Ensure all WLED devices are powered on, and connected to your Wi-Fi.
                        From the WLED web-interface, LedFx will require led setup configured, 
                        user interface name, and Sync setup enabled E1.31 support.

                        Note, this will delete current LedFx devices, 
                        scan your network for WLED,
                        and automatically add all devices found to LedFx.
                        Are you sure you wish to continue?
                    </DialogContentText>

                        <DialogActions className={classes.bottomContainer}>
                            <Box
                                flex={1}
                                display="flex"
                                justifyContent="flex-end"
                                className={classes.actionButtons}
                            >
                                <Button
                                    className={classes.button}
                                    onClick={this.handleCancel}
                                    color="primary"
                                >
                                    {'Cancel'}
                                </Button>
                                <Button
                                    className={classes.button}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!deviceType}
                                >
                                    {'Submit'}
                                </Button>
                            </Box>
                        </DialogActions>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withStyles(styles)(DeviceAutoAddDialog);

DeviceAutoAddDialog.propTypes = {
    deviceTypes: PropTypes.object,
};

DeviceAutoAddDialog.defaultProps = {
    deviceTypes: {},
};
