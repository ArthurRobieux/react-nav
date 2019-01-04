import React, { Component } from 'react';

import './TopHeader.css';


const root = document.getElementById("root");


let translations = {};

const club_id = root.dataset.club_id;

class TopHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubName: '',
            clubLogo: '',
        }
    }
    // Get members data from API and save them in state
    getClubInformations(){

        const API_URL = 'http://api.local.sporteasy.net:8000/v2.1/clubs/' + club_id + '/';

        fetch(API_URL, {
            method: "GET",
            credentials: 'include',
        })
        .then(response =>
            response.json()
        )
        .then(json_response =>
            this.createClubData(json_response)
        )
    }

    createClubData(json_response){
        this.setState({
            clubName: json_response.name,
            clubLogo: json_response.logo['168x168'],
        })
    }

    showHideTopHeader(){
        var prevScrollpos = window.pageYOffset;
        window.onscroll = function() {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > 50) {
                if (prevScrollpos > currentScrollPos) {
                    document.getElementById("top_header").style.top = "0";
                } else {
                    document.getElementById("top_header").style.top = "-70px";
                }
            }
            prevScrollpos = currentScrollPos;
        }
    }

    componentDidMount(){
        this.getClubInformations();
    }

    render() {
        this.showHideTopHeader();
        return(
            <div id={"top_header"}>
                <img className={"club_logo"} src={"https://upload.wikimedia.org/wikipedia/fr/thumb/0/0f/Logo_Stade_fran%C3%A7ais_PR_2018.svg/840px-Logo_Stade_fran%C3%A7ais_PR_2018.svg.png"} alt={"club_logo"}/>
                {/*<div className={"club_logo"}>{this.state.clubLogo}</div>*/}
                {/*<div className={"club_name"}>{this.state.clubName}</div>*/}
                <div className={"club_name"}>Stade Français</div>
            </div>
        );



    }


}

export default TopHeader;
