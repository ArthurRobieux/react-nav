import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import CalendarApp from '../Calendar/CalendarApp';
import MembersListApp from '../MembersList/MembersListApp';
import TeamsApp from '../Teams/TeamsApp';
import SettingsApp from '../Settings/SettingsApp';

import './SideHeader.css';

class SideHeader extends Component {

    render() {

        return(

            <Router>
                <div>

                   <nav className="main-menu">

                        <img className={"side_header_image"} src="img/logo.png" id="logo"/>

                        <ul>
                            <li>
                                <Link to="/calendar">
                                    <i className="fa fa-members"><img className={"side_header_image"} src="img/calendar.png" id="members"/></i>
                                    <span className="nav-text">Calendrier</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/roster">
                                    <i className="fa fa-members"><img className={"side_header_image"} src="img/members.png" id="members"/></i>
                                    <span className="nav-text">Membres</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/teams">
                                    <i className="fa fa-members"><img className={"side_header_image"} src="img/teams.png" id="members"/></i>
                                    <span className="nav-text">Equipes</span>
                                </Link>

                            </li>
                            <li>
                                <Link to="/settings">
                                    <i className="fa fa-settings"><img className={"side_header_image"} src="img/settings.png" id="members"/></i>
                                    <span className="nav-text">Paramètres</span>
                                </Link>
                            </li>
                        </ul>


                        <ul className="logout">
                            <li>
                                <a href="#">
                                    <i className="fa fa-home"><img className={"side_header_image"} src="img/logout.png" id="logout"/></i>
                                    <span className="nav-text">Se déconnecter</span>
                                </a>
                            </li>
                        </ul>

                    </nav>

                    <div id={"page_content"}>
                        <Route path="/calendar" component={CalendarApp} />
                        <Route path="/roster" component={MembersListApp} />
                        <Route path="/teams" component={TeamsApp} />
                        <Route path="/settings" component={SettingsApp} />
                    </div>
                </div>
            </Router>
        );



    }


}

export default SideHeader;
