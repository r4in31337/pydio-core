/**
 * Copyright (c) 2013-present, Facebook, Inc. All rights reserved.
 *
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import shallowCompare from 'react/lib/shallowCompare';
import { TransitionMotion } from 'react-motion';
import stripStyle from 'react-motion/lib/stripStyle';
import {springify, buildTransform} from './utils';

let counter=0

const DEFAULT_ANIMATION={stiffness: 200, damping: 22, precision: 0.1}

const makeTransition = (originStyles, targetStyles, enter, leave) => {
    return (Target) => {
        class TransitionGroup extends React.PureComponent {

            constructor(props) {
                super(props);
                this.state = {
                    styles: this.build(props)
                };
            }

            componentWillReceiveProps(nextProps) {
                this.setState({
                    styles: this.build(nextProps)
                });
            }

            build(props) {
                return React.Children
                    .toArray(props.children)
                    .filter(child => child) // Removing null values
                    .map(child => {
                        return !props.ready
                            ? null : {
                                key: child.key || `t${counter++}`,
                                data: {element: child},
                                style: springify(targetStyles, enter || DEFAULT_ANIMATION)
                            }
                    })
                    .filter(child => child); // Removing null values
            }

            willEnter(transitionStyle) {

                console.log("Will enter ", this.props)
                return {
                    ...stripStyle(transitionStyle.style),
                    ...originStyles
                };
            }

            willLeave(transitionStyle) {
                return {
                    ...transitionStyle.style,
                    ...springify(originStyles, leave || DEFAULT_ANIMATION)
                }
            }

            render() {

                // Making sure we fliter out properties
                const {ready, ...props} = this.props

                console.log("Transition styles ", this.state.styles)

                return (
                    <TransitionMotion
                        styles={this.state.styles}
                        willLeave={this.willEnter.bind(this)}
                        willEnter={this.willEnter.bind(this)}
                        >
                        {styles =>
                            <Target {...props}>
                            {styles.map(({key, style, data}) => {

                                console.log("Transition child being rendered")

                                const Child = data.element.type
                                const itemProps = data.element.props

                                const transform = buildTransform(style, {
                                    length: 'px', angle: 'deg'
                                });

                                return (
                                    <Child
                                        key={data.element.key}
                                        {...itemProps}
                                        style={{
                                            ...itemProps.style,
                                            ...style,
                                            transform
                                        }}
                                    />
                                );
                            })}
                            </Target>
                        }
                    </TransitionMotion>
                );
            }
        }

        TransitionGroup.propTypes = {
            ready: React.PropTypes.bool.isRequired
        }

        TransitionGroup.defaultProps = {
            ready: true
        }

        return TransitionGroup
    }
};

export default makeTransition;
