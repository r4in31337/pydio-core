const React = require('react');
const {TextField} = require('material-ui')
import ActionDialogMixin from './ActionDialogMixin'
import CancelButtonProviderMixin from './CancelButtonProviderMixin'
import SubmitButtonProviderMixin from './SubmitButtonProviderMixin'

/**
 * Ready-to-use dialog for requiring information (text or password) from the user
 *
 */
export default React.createClass({

    propTypes: {
        /**
         * Message ID used for the dialog title
         */
        dialogTitleId:React.PropTypes.string,
        /**
         * Message ID used for dialog legend
         */
        legendId:React.PropTypes.string,
        /**
         * MessageID used for the field Floating Label Text
         */
        fieldLabelId:React.PropTypes.string,
        /**
         * Either text or password
         */
        fieldType: React.PropTypes.oneOf(['text', 'password']),
        /**
         * Callback used at submit time
         */
        submitValue:React.PropTypes.func.isRequired,
        /**
         * Preset value displayed in the text field
         */
        defaultValue:React.PropTypes.string,
        /**
         * Select a part of the default value [NOT IMPLEMENTED]
         */
        defaultInputSelection:React.PropTypes.string
    },

    mixins:[
        ActionDialogMixin,
        CancelButtonProviderMixin,
        SubmitButtonProviderMixin
    ],

    getDefaultProps: function(){
        return {
            dialogTitle: '',
            dialogIsModal: true,
            fieldType: 'text'
        };
    },
    /**
     * Trigger props callback and dismiss modal
     */
    submit(){
        this.props.submitValue(this.refs.input.getValue());
        this.dismiss();
    },
    render: function(){
        return (
            <div style={{width:'100%'}}>
                <div className="dialogLegend">{MessageHash[this.props.legendId]}</div>
                <TextField
                    floatingLabelText={MessageHash[this.props.fieldLabelId]}
                    ref="input"
                    onKeyDown={this.submitOnEnterKey}
                    defaultValue={this.props.defaultValue}
                    type={this.props.fieldType}
                    fullWidth={true}
                />
            </div>
        );
    }

});
