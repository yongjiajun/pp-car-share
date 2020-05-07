import React, { Component } from 'react'

export default class staffDashboard extends Component {
    render() {
        const { isAdmin } = this.props;
        return (
            <div>
                <p>Staff Dashboard</p>
            </div>
        )
    }
}
