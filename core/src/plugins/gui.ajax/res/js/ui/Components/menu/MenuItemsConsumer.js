const React = require('react')
const Controller = require('pydio/model/controller')
import Utils from './Utils'

export default function(Component){

    class Wrapped extends React.Component{

        constructor(props, context){
            super(props, context);
            this.state = {
                menuItems: this.props.menuItem || []
            };
        }

        componentDidMount(){

            if(this.props.controller && !this.props.menuItems){
                this._observer = () => {
                    const actions = this.props.controller.getContextActions('genericContext', null, this.props.toolbars);
                    const menuItems = Utils.pydioActionsToItems(actions);
                    this.setState({menuItems: menuItems});
                };
                if(this.props.controller === this.props.pydio.Controller){
                    this.props.pydio.observe("actions_refreshed", this._observer);
                }else{
                    this.props.controller.observe("actions_refreshed", this._observer);
                }
                this._observer();
            }

        }

        componentWillUnmount(){
            if(this._observer){
                if(this.props.controller === this.props.pydio.Controller){
                    this.props.pydio.stopObserving("actions_refreshed", this._observer);
                }else{
                    this.props.controller.stopObserving("actions_refreshed", this._observer);
                }
            }
        }

        componentWillReceiveProps(nextProps){
            if(nextProps.menuItems && nextProps.menuItems !== this.props.menuItems){
                this.setState({menuItems: nextProps.menuItems});
            }
        }


        render(){
            return <Component {...this.props} menuItems={this.state.menuItems}/>
        }

    }


    Wrapped.propTypes = {
        menuItems   : React.PropTypes.array,
        toolbars    : React.PropTypes.array,
        controller  : React.PropTypes.instanceOf(Controller),
        pydio       : React.PropTypes.instanceOf(Pydio)
    };

    return Wrapped;

}