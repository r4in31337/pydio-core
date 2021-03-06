const {Component, PropTypes} = require('react')
const {FlatButton, FontIcon} = require('material-ui')
const {muiThemeable} = require('material-ui/styles')
const Color = require('color')
const Pydio = require('pydio')
const {PydioContextConsumer} = Pydio.requireLib('boot')

class EmptyStateView extends Component{

    constructor(props, context){
        super(props, context);
    }

    render(){
        const {style, iconClassName, primaryTextId, secondaryTextId, actionLabelId, actionCallback, actionStyle, actionIconClassName, getMessage} = this.props;

        const mainColor = Color(this.props.muiTheme.palette.primary1Color);

        const styles = {
            container: {
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                height: '100%',
                width: '100%',
                backgroundColor:mainColor.lightness(97).rgb().toString(),
                ...style
            },
            centered : {
                maxWidth: 280,
                textAlign:'center',
                color: mainColor.fade(0.6).toString()
            },
            icon : {
                fontSize: 100
            },
            primaryText : {
                fontSize: 16,
                fontWeight: 500,
            },
            secondaryText : {
                marginTop: 20,
                fontSize: 13
            },
            buttonContainer: {
                marginTop: 100,
                textAlign: 'center'
            },
            buttonStyle: {
                color: this.props.muiTheme.palette.accent2Color
            }
        };
        const buttonIcon = actionIconClassName ? <FontIcon className={actionIconClassName}/> : null;
        return (
            <div style={styles.container}>
                <div style={styles.centered}>
                    <div className={iconClassName} style={styles.icon}/>
                    <div style={styles.primaryText}>{getMessage(primaryTextId)}</div>
                    {secondaryTextId &&
                        <div style={styles.secondaryText}>{getMessage(secondaryTextId)}</div>
                    }
                    {actionLabelId && actionCallback &&
                        <div style={{...styles.buttonContainer, ...actionStyle}}>
                            <FlatButton style={styles.buttonStyle} label={getMessage(actionLabelId)} onTouchTap={actionCallback} icon={buttonIcon}/>
                        </div>
                    }
                </div>
            </div>
        );

    }

}

EmptyStateView.propTypes = {

    pydio: PropTypes.instanceOf(Pydio).isRequired,
    iconClassName: PropTypes.string.isRequired,
    primaryTextId: PropTypes.string.isRequired,

    secondaryTextId: PropTypes.string,
    actionLabelId: PropTypes.string,
    actionCallback: PropTypes.func,
    actionStyle: PropTypes.object,

    style: PropTypes.object,
    getMessage: PropTypes.func

};

EmptyStateView = PydioContextConsumer(EmptyStateView);
EmptyStateView = muiThemeable()(EmptyStateView);

export {EmptyStateView as default}