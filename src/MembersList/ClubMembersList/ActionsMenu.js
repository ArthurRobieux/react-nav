import React, { Component } from 'react';
import './ClubMembersList.css';
import Popup from "reactjs-popup";
import ClubMembersList from "./ClubMembersList";

class ActionsMenu extends Component {

  // Get season club member list
  getApiClubSeasonMemberList(season_id, ClubMembersList){

    ClubMembersList.setState({members_data: []});
    let API_URL = '';

    if(season_id === 'all'){
        API_URL = ClubMembersList.props.API_URL + '/v2.1/clubs/' + ClubMembersList.props.club_id + '/profiles/';
    }
    else {
        API_URL = ClubMembersList.props.API_URL + '/v2.1/clubs/' + ClubMembersList.props.club_id
            + '/profiles/?season_id=' + season_id;
    }

    fetch(API_URL, {
        method: "GET",
        credentials: 'include',
    })
    .then(response =>
        response.json()
    )
    .then(json_response =>
        ClubMembersList.createDataFromJson(json_response),
    )
  }

  updateSelectionActionsButtons(ClubMembersList){

      let list_buttons = document.getElementsByClassName("selection_action_button");

      for(var i=0; i<list_buttons.length; i++){
          if(ClubMembersList.state.selection.length === 0){
              list_buttons[i].style['pointer-events'] = 'none';
              list_buttons[i].style['opacity'] = '0.5';
          }
          else{
              list_buttons[i].style['pointer-events'] = 'all';
              list_buttons[i].style['opacity'] = '0.75';
          }
      }
  }

  addColumn(ClubMembersList){
      console.log(ClubMembersList.state.columns);

      var columns = ClubMembersList.state.columns;

      const newColumn = {
            Header: "newColumn",
            accessor: 'first_name',
            width: 150,
            Filter: ({ filter, onChange }) => ClubMembersList.getGenericFilter(filter, onChange, 'first_name'),
            sortable: false,
        };
        columns[3].columns.push(newColumn);

      ClubMembersList.setState({columns:columns});
  }

  // Show Teams checkbox filter
  showTeamsFilter(){
      let teamsFilter = document.getElementById("general_teams_filter");

      if(teamsFilter) {
          if (teamsFilter.style.display === 'block') {
              teamsFilter.style.display = 'none';
          }
          else {
              teamsFilter.style.display = 'block';
          }
          document.addEventListener('click', function (event) {
          var isClickInside = teamsFilter.contains(event.target);
          if (!isClickInside && teamsFilter.style.display === 'block') {
              teamsFilter.style.display = 'none';
          }
      }, true);
      }

  }

  // Update state.selected_teams with checked_checkbox
  getSelectedTeams(ClubMembersList){

      const options = ClubMembersList.state.teams_options;

      // If option checkbox is checked, add this option
      let checked_checkbox = [];

      for (var p = 0; p < options.length; p++) {
          let checkbox = document.getElementById("team_selection_" + options[p]);
          if (checkbox.checked) {
              checked_checkbox.push(options[p]);
          }
      }
      ClubMembersList.setState({selected_teams: checked_checkbox});
  }

  showTeamsNames(ClubMembersList){
      // If no selection
      if(ClubMembersList.state.selected_teams.length === 0){
          return(
              <div className={"selected_teams"}>
                  Toutes les équipes
              </div>
          )
      }
      // If one team is selected
      else{
          var teams_list = '';
          for(var i=0; i<ClubMembersList.state.selected_teams.length; i++){
              teams_list = teams_list + ClubMembersList.state.selected_teams[i] + "-";
          }
          teams_list = teams_list.substring(0, teams_list.length - 1);
          return(
              <div className={"selected_teams"}>
                  {teams_list}
              </div>
          )
      }
  }

  render() {

    const ClubMembersList = this.props.ClubMembersList;
    this.updateSelectionActionsButtons(ClubMembersList);

    const options = ClubMembersList.state.teams_options;

    return(

        <div>

          {/* Menu */}
          <div id={"members_list_menu"}>

              {/*Add column*/}
              {/*<button className={"action_button"} onClick={() => this.addColumn(ClubMembersList)}>Add column</button>*/}
              {/*Send a global message*/}
              {/*<button className={"action_button"}>Send a message</button>*/}

              {/*Add a member*/}
              <a className={"action_link"} href={"/members/invite/"}>
                <button className={"action_button add_a_member_button"}>
                    <img className={"action_image"} src={ClubMembersList.props.SE_URL + "/static/themes/v2/images/frontend/clubs/icon_addMembers.svg"}/>
                    {/*{ClubMembersList.props.translations.add_a_member}*/}
                </button>
              </a>

              {/*Export members list*/}
              <a href={"/members/export/"}>
                <button className={"action_button"}>
                    <img className={"action_image"} src={ClubMembersList.props.SE_URL + "/static/themes/v2/images/frontend/clubs/icon_export.svg"}/>
                </button>
              </a>

              {/*Edition Mode*/}
              <button onClick={ClubMembersList.changeEditionMode} className={"action_button"}>
                    <img className={"action_image"} src={ClubMembersList.props.SE_URL + "/static/themes/v2/images/frontend/clubs/icon_more.svg"}/>
              </button>

              {/*General Filter*/}
              <input className={"action_filter"} type={"text"} placeholder={ClubMembersList.props.translations.search + ".."}
                     value={ClubMembersList.state.search} onChange={e => ClubMembersList.setState({search: e.target.value})}/>

              {/*Seasons Filter*/}
              <select onChange={e => this.getApiClubSeasonMemberList(e.target.value, ClubMembersList)}
                    className={"select_season"}>
                    <option value='all'>{ClubMembersList.props.translations.all}</option>
                    {ClubMembersList.state.seasons_list.map(season => (
                        <option value={season.id}>{season.slug_name}</option>
                    ))}
              </select>

              {/*Teams Checkbox Filter*/}
              <div onClick={() => this.showTeamsFilter()} className={"button_general_teams_filter"}>
                {this.showTeamsNames(ClubMembersList)}
                <div id={"general_teams_filter"}>
                    {options.map(option => (
                            <label>
                                <div className={"checkbox_filter_choice"}>
                                    <input type={"checkbox"} id={"team_selection_"+ option} onChange={event => this.getSelectedTeams(ClubMembersList)}/>
                                    {option}
                                </div>
                            </label>
                    ))}
                </div>
              </div>


          </div>

      </div>


    );

  }


}

export default ActionsMenu;
