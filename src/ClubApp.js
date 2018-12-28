import React, { Component } from "react";
import TopHeader from './TopHeader/TopHeader';
import SideHeader from './SideHeader/SideHeader';

class ClubApp extends Component {

    render() {
        return (
            <div>
                <TopHeader/>
                <SideHeader/>
            </div>
        );
    }
}

export default ClubApp;