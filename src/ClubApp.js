import React, { Component } from "react";
import CalendarApp from './Calendar/CalendarApp';
import MembersListApp from './MembersList/MembersListApp';
import SideHeader from './SideHeader/SideHeader';

class ClubApp extends Component {

    render() {
        return (
            <div>
                <SideHeader/>
                {/*<MembersListApp/>*/}
            </div>
        );
    }
}

export default ClubApp;