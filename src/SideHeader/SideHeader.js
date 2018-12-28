import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import CalendarApp from '../Calendar/CalendarApp';
import MembersListApp from '../MembersList/MembersListApp';

import './SideHeader.css';

class SideHeader extends Component {

    render() {

        return(

            <Router>
                <div>

                   <nav className="main-menu">

                        <img src="img/logo.png" id="logo"/>

                        <ul>
                            <li>
                                <Link to="/roster">
                                    <i className="fa fa-members"><img src="img/members.png" id="members"/></i>
                                    <span className="nav-text">Membres</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/calendar">
                                    <i className="fa fa-members"><img src="img/calendar.png" id="members"/></i>
                                    <span className="nav-text">Calendrier</span>
                                </Link>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="fa fa-teams"><img src="img/teams.png" id="teams"/></i>
                                    <span className="nav-text">Equipes</span>
                                </a>

                            </li>
                            <li>
                                <a href="#">
                                    <i className="fa fa-settings"><img src="img/settings.png" id="settings"/></i>
                                    <span className="nav-text">Paramètres</span>
                                </a>
                            </li>
                        </ul>


                        <ul className="logout">
                            <li>
                                <a href="#">
                                    <i className="fa fa-home"><img src="img/logout.png" id="logout"/></i>
                                    <span className="nav-text">Se déconnecter</span>
                                </a>
                            </li>
                        </ul>

                    </nav>
                    
                    <Route path="/calendar" component={CalendarApp} />
                    <Route path="/roster" component={MembersListApp} />
                </div>
            </Router>
        );



    }


}

export default SideHeader;
