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

    componentDidMount(){
        this.getClubInformations();
    }

    render() {

        return(
            <div id={"top_header"}>
                <img className={"club_logo"} src={"http://cdn.local.sporteasy.net:8000/media/image/site_logo/168x168/1d41b2b8fafbcaa31a38dc5d5aa51567/9dbf8cb0db9011e8ae4ff7ac7f9001e7.jpg"} alt={"club_logo"}/>
                {/*<div className={"club_logo"}>{this.state.clubLogo}</div>*/}
                <div className={"club_name"}>{this.state.clubName}</div>
            </div>
        );



    }


}

export default TopHeader;
