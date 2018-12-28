import React, { Component } from 'react';
import './SideHeader.css';

class SideHeader extends Component {

    render() {

        return(


             <nav className="main-menu">

                    <img src="img/logo.png" id="logo"/>

                    <ul>
                        <li>
                            <a href="#">
                                <i className="fa fa-teams"><img src="img/calendar.png" id="teams"/></i>
                                <span className="nav-text">
                            Calendrier
                        </span>
                            </a>

                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-teams"><img src="img/teams.png" id="teams"/></i>
                                <span className="nav-text">
                            Equipes
                        </span>
                            </a>

                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-members"><img src="img/members.png" id="members"/></i>
                                <span className="nav-text">
                            Membres
                        </span>
                            </a>

                        </li>
                        {/*<li>*/}
                            {/*<a href="#">*/}
                                {/*<i className="fa fa-messages"><img src="img/messages.png" id="messages"/></i>*/}
                                {/*<span className="nav-text">*/}
                            {/*Messages*/}
                        {/*</span>*/}
                            {/*</a>*/}

                        {/*</li>*/}
                        {/*<li>*/}
                            {/*<a href="#">*/}
                                {/*<i className="fa fa-statistics"><img src="img/statistics.png" id="statistics"/></i>*/}
                                {/*<span className="nav-text">*/}
                            {/*Statistiques*/}
                        {/*</span>*/}
                            {/*</a>*/}
                        {/*</li>*/}
                        <li>
                            <a href="#">
                                <i className="fa fa-settings"><img src="img/settings.png" id="settings"/></i>
                                <span className="nav-text">
                            Paramètres
                        </span>
                            </a>
                        </li>
                    </ul>


                    <ul className="logout">
                        <li>
                            <a href="#">
                                <i className="fa fa-home"><img src="img/logout.png" id="logout"/></i>
                                <span className="nav-text">
                                    Se déconnecter
                                </span>
                            </a>
                        </li>
                    </ul>


                </nav>

            );



  }


}

export default SideHeader;
