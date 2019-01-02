import React, { Component } from 'react';
import './ClubMembersList.css';
import 'react-table/react-table.css'
import Popup from 'reactjs-popup'

import Chance from "chance";

import MembersList from "./MembersList";
import MemberOptions from "./MemberOptions"


const chance = new Chance();

function getData(testData) {
  const data = testData.map(item => {
    const _id = chance.guid();
    return {
      _id,
      ...item
    };
  });
  return data;
}

class ClubMembersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      selectAll: false,
      members_data: [],
      isEditionMode: false,
      search: '',
      columns_name: [],
      teams_options: [],
      columns: [],
      seasons_list: [],
      teams_list: [],
      selected_teams: [],
      actual_sorting: {},
      selected_team_assignation: '',
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

  ///////////////////
  /// API REQUEST ///
  ///////////////////

  // Get members data from API and save them in state
  getApiSeasonClubList(){

    const API_URL = this.props.API_URL + '/v2.1/clubs/' + this.props.club_id + '/seasons';

    fetch(API_URL, {
        method: "GET",
        credentials: 'include',
    })
    .then(response =>
        response.json()
    )
    .then(json_response =>
        this.createSeasonClubList(json_response)
    )
  }

  // Get seasons list from API
  createSeasonClubList(api_response){
      let seasons_list = [];
      for(var i=0; i<api_response['results'].length; i++){
          seasons_list.push(api_response['results'][i]);
      }
      this.setState({seasons_list: seasons_list});
  }

  // Get members data from API and save them in state
  getApiTeamClubList(){

    const API_URL = this.props.API_URL + '/v2.1/clubs/' + this.props.club_id + '/teams';

    fetch(API_URL, {
        method: "GET",
        credentials: 'include',
    })
    .then(response =>
        response.json()
    )
    .then(json_response =>
        this.createTeamClubList(json_response)
    )
  }

  // Get seasons list from API
  createTeamClubList(api_response){
      let teams_list = [];
      for(var i=0; i<api_response['results'].length; i++){
          teams_list.push(api_response['results'][i]);
      }
      this.setState({teams_list: teams_list});
      this.setState({selected_team_assignation: teams_list[0].id});
  }

  // Delete selected members from the club
  affectSelectionToTeam(){
    let selected_members = [];
    for(var i=0; i<this.state.members_data.length; i++){
        if(this.isSelected(this.state.members_data[i]._id)){
            selected_members.push(this.state.members_data[i].id);
        }
    }
    console.log(selected_members);
    console.log(this.state.selected_team_assignation);
    // API request
  }

  // Delete selected members from the club
  deleteSelectionFromClub(){
    let selected_members = [];
    for(var i=0; i<this.state.members_data.length; i++){
        if(this.isSelected(this.state.members_data[i]._id)){
            selected_members.push(this.state.members_data[i].id);
        }
    }
    this.deleteAPIClubMember(selected_members);
  }

  // Get members data from API and save them in state
  deleteAPIClubMember(profiles){

    const API_URL = this.props.API_URL + '/v2.1/clubs/' + this.props.club_id + '/profiles/';

    fetch(API_URL, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            profiles: profiles,
        }),
    })
    .then(response =>
        response.json()
    )
    .then(json_response =>
        console.log(json_response),
        window.location.reload(),
    )
  }

  // Get members data from API and save them in state
  getApiClubMemberList(){

    const API_URL = this.props.API_URL + '/v2.1/clubs/' + this.props.club_id + '/profiles/';

    fetch(API_URL, {
        method: "GET",
        credentials: 'include',
    })
    .then(response =>
        response.json()
    )
    .then(json_response =>
        this.createDataFromJson(json_response),
    )
  }

  // For each member in the API response, we will create a member and add him to state.members_data
  createDataFromJson(api_response){

    let columns_name = api_response.config.headers;
    this.setState({columns_name: columns_name});
    console.log(this.state.columns_name);

    let members_data = [];

    for(var i=0; i<api_response.results.length; i++){
      let new_member = {
        profile: api_response.results[i].profile,
        first_name: api_response.results[i].profile.first_name,
        last_name: api_response.results[i].profile.last_name,
        email: api_response.results[i].profile.email,
        id: api_response.results[i].profile.id,
        height: api_response.results[i].profile.weight,
        weight: api_response.results[i].profile.height,
        licence_number: api_response.results[i].licence_number,
        phone_number: api_response.results[i].profile.phone_number,
        teams: api_response.results[i].teams,
        status: api_response.results[i].profile.status.slug_name,
        parents: api_response.results[i].profile.parents,
      };
      members_data.push(new_member);
    }
    console.log(members_data);
    this.setState({members_data: getData(members_data)});
    this.getTeamsOptions();
    this.getColumns();
  }

  // Get in state all the possible choice for teams
  getTeamsOptions(){
      // Get available options
      let options = [];

      // For each member
      for (var i = 0; i < this.state.members_data.length; i++) {
          // For each team
          for (var j = 0; j < this.state.members_data.length; j++) {
              if (!options.includes(this.state.members_data[i]['teams'][j])
                  && this.state.members_data[i]['teams'][j] !== undefined) {
                  options.push(this.state.members_data[i]['teams'][j]);
              }
          }
      }
      this.setState({teams_options:options});
  }

  // Create table columns
  getColumns(){

      // Define columns
      let columns = [
                        {
                            Header: this.props.translations.profile,
                            fixed: 'left',
                            columns: [
                                {
                                    Header: '',
                                    accessor: 'profile',
                                    width: 40,
                                    filterable: false,
                                    sortable: false,
                                    className: "center_element",
                                    resizable: false,
                                    Cell: profile => (<img src={profile.value.avatar["120x120"]}
                                                           alt={profile.value.avatar["120x120"]}
                                                           className={"avatar"}
                                                           onClick={() => this.showPopUp(profile.value)}/>),
                                },
                                {
                                    Header: 'Parents',
                                    accessor: 'profile',
                                    width: 80,
                                    filterable: false,
                                    sortable: false,
                                    className: "center_element",
                                    resizable: false,
                                    Cell: profile => (this.hasParent(profile)),
                                },
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='last_name'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: "last_name",
                                    width: 150,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    filterMethod: (filter, row) => this.getSelectFilterMethod(filter, row, 'last_name'),
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'last_name', 'select'),
                                },
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='first_name'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: "first_name",
                                    width: 150,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    filterMethod: (filter, row) => this.getCheckboxFilterMethod(filter, row, 'first_name'),
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'first_name', 'checkbox'),
                                },
                            ]
                        },
                        {
                            Header: this.props.translations.infos,
                            columns: [
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='email'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: 'email',
                                    width: 280,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'email'),
                                },
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='teams'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: 'teams',
                                    width: 175,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    filterMethod: (filter, row) => this.getCheckboxTeamsFilterMethod(filter, row, 'teams'),
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'teams', 'teams_checkbox'),
                                },
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='licence_number'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: 'licence_number',
                                    width: 200,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'licence_number'),
                                },
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='phone_number'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: 'phone_number',
                                    width: 150,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'phone_number'),
                                },
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='height'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: 'height',
                                    width: 150,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'height'),
                                },
                                {
                                    Header: () => (<span>{this.state.columns_name.filter(function(item){return item['slug_name']==='weight'}, this.state.columns_name)[0]["localized_name"]}<span className={"filters_arrow"}>▼</span></span>),
                                    accessor: 'weight',
                                    width: 150,
                                    sortable: false,
                                    Cell: this.renderEditable,
                                    Filter: ({ filter, onChange }) => this.getGenericFilter(filter, onChange, 'weight'),
                                },
                            ]
                        },
                    ];

      // Calcul max number of parents
      let max_parents = 0;

      for(var p=0; p<this.state.members_data.length; p++){
          if(this.state.members_data[p].parents.length > max_parents){
              max_parents = this.state.members_data[p].parents.length;
          }
      }

      // Create parents columns
      for(let x=0; x<max_parents; x++){
          let parent_column = {
                            Header: this.props.translations.parent + " " + parseInt(x+1),
                            columns: [
                                {
                                    Header: this.state.columns_name.filter(function(item){return item['slug_name']==='last_name'}, this.state.columns_name)[0]["localized_name"],
                                    accessor: 'parents',
                                    width: 150,
                                    filterable: false,
                                    Cell: parents => (this.showParentName(parents, x+1)),
                                },
                                {
                                    Header: this.state.columns_name.filter(function(item){return item['slug_name']==='email'}, this.state.columns_name)[0]["localized_name"],
                                    accessor: 'parents',
                                    width: 150,
                                    filterable: false,
                                    Cell: parents => (this.showParentEmail(parents, x+1)),
                                },
                                {
                                    Header: this.state.columns_name.filter(function(item){return item['slug_name']==='phone_number'}, this.state.columns_name)[0]["localized_name"],
                                    accessor: 'parents',
                                    width: 150,
                                    filterable: false,
                                    resizable: false,
                                    Cell: parents => (this.showParentPhone(parents, x+1)),
                                },
                            ]
                        };
                        columns.push(parent_column);
      }

      columns.push(
          {
            Header: () => (this.showGeneralOptions()),
            fixed: 'right',
            accessor: 'id',
            width: 40,
            filterable: false,
            sortable: false,
            className: "center_element",
            resizable: false,
            Cell: id => (<MemberOptions ClubMembersList={this} id={id.value}/>),
          },

      );

      // let newHeader = { Header: "newHeader", columns: [] };
      // columns.push(newHeader);

      this.setState({columns:columns});
  }

  // Show general options with checkbox
  showGeneralOptions(){
      return(
          <Popup trigger={<button className="selection_action_button settings_button">...</button>}
                                        closeOnDocumentClick
                                        position={"left top"}
                                        >


              {/*Affect players to a team*/}
              <span className={"popup-modal"}>
                  <Popup
                        trigger={<div className={"member_option js-popin-form"}>{this.props.translations.affect_to_team} ({this.state.selection.length})</div>}
                        closeOnDocumentClick
                        modal
                  >
                      <div className={"popup-modal-content"}>

                          <h3>{this.props.translations.assign_players_to_team}</h3>

                          {this.props.translations.choose_a_team}
                          <br/>
                          <select onChange={e => this.setState({selected_team_assignation:(e.target.value)})}>
                            {this.state.teams_list.map(team => (
                                <option value={team.id}>{team.name}</option>
                            ))}
                          </select>
                          <br/><br/>
                          {this.props.translations.team_assignation_confirmation}
                          <br/><br/>
                          {this.showSelection()}
                          <br/>
                          <button className={"action_button"} onClick={() => this.affectSelectionToTeam()}>
                              {this.props.translations.assign_members}
                          </button>

                      </div>


                  </Popup>
              </span>

              {/*Delete players from club*/}
              <span className={"popup-modal"}>
                  <Popup
                        trigger={<div className={"warning member_option js-popin-form"}>{this.props.translations.delete_from_club} ({this.state.selection.length})</div>}
                        closeOnDocumentClick
                        modal
                  >
                      <div className={"popup-modal-content"}>

                          <h3>{this.props.translations.delete_players_from_club}</h3>

                          {this.props.translations.delete_from_club_confirmation}
                          <br/><br/>
                          {this.showSelection()}
                          <br/>
                          <button className={"action_button"} onClick={() => this.deleteSelectionFromClub()}>
                              {this.props.translations.delete_from_club}
                          </button>

                      </div>
                  </Popup>
              </span>


          </Popup>
      )
  }

  updateSelectionActionsButtons(){

      let list_buttons = document.getElementsByClassName("selection_action_button");

      for(var i=0; i<list_buttons.length; i++){
          if(this.state.selection.length === 0){
              list_buttons[i].style['pointer-events'] = 'none';
              list_buttons[i].style['opacity'] = '0.3';
              list_buttons[i].style['background'] = 'lightgrey';
          }
          else{
              list_buttons[i].style['pointer-events'] = 'all';
              list_buttons[i].style['opacity'] = '1';
              list_buttons[i].style['background'] = '#3cabff';
          }
      }
  }

  ///////////////////////////
  /// SELECTION FUNCTIONS ///
  ///////////////////////////

  // Add/delete lines to state.selection
  toggleSelection = (key) => {
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  // Add/delete all the lines from state.selection
  toggleAll = () => {

    const selectAll = !this.state.selectAll;
    const selection = [];
    console.log(this);
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };

  // Return true if key-line is selected
  isSelected = key => {
    return this.state.selection.includes(key);
  };

  // Show selected lines
  showSelection = () => {
    let selected_members = [];
    for(var i=0; i<this.state.members_data.length; i++){
        if(this.isSelected(this.state.members_data[i]._id)){
            selected_members.push(this.state.members_data[i]);
        }
    }
    return(
        <div className={"list_selected_members"}>
            {selected_members.map(member => (
                this.showSelectedMember(member)
            ))}
        </div>
    )
  };

  // Show selected members in Popin
  showSelectedMember(member){
      return(
          <div className={"member"}>
              <img src={member.profile.avatar["120x120"]} alt={member.profile.avatar["120x120"]} className={"avatar"}/>
              {member.first_name} {member.last_name}
          </div>
      )
  }

  ///////////////
  /// FILTERS ///
  ///////////////

  // Generic filter (sorting + text search) + Specific filter
  getGenericFilter(filter, onChange, column_name, style){

      return(
          <div>
              <div id={"filters_"+column_name} className={"filters"}>

                  {/*Sorting filter*/}
                  <div id={"sorting_filter"}>
                      <div className={"sorting_choice_title"}>
                          {this.props.translations.order}
                      </div>
                      <div className={"sorting_choice"} onClick={()=> this.sortTable(column_name, 'asc')}>
                          ▲ {this.props.translations.ascending}
                      </div>
                      <div className={"sorting_choice"} onClick={()=> this.sortTable(column_name, 'desc')}>
                          ▼ {this.props.translations.descending}
                      </div>
                  </div>

                  {/*Text filter*/}
                  <div id={"text_filter"}>
                    <input id={"text_filter"} type={"text"} onChange={event => onChange(event.target.value)}
                           placeholder={this.props.translations.search + ".."}/>
                  </div>

                  {/*Specific filter*/}
                  {this.getSpecificFilter(filter, onChange, column_name, style)}
              </div>
          </div>
      );
  }

  getSpecificFilter(filter, onChange, column_name, style){

    // Get all options for this column
    let options = [];
    if(style==='teams_checkbox') {
        // For each member
        for (var i = 0; i < this.state.members_data.length; i++) {
            // For each team
            for (var j = 0; j < this.state.members_data.length; j++) {
                if (!options.includes(this.state.members_data[i][column_name][j])
                    && this.state.members_data[i][column_name][j] !== undefined) {
                    options.push(this.state.members_data[i][column_name][j]);
                }
            }
        }
    }
    else {
        for (var i = 0; i < this.state.members_data.length; i++) {
            if (!options.includes(this.state.members_data[i][column_name])
                && this.state.members_data[i][column_name] !== '') {
                options.push(this.state.members_data[i][column_name]);
            }
        }
    }
    options = options.sort();

     // Select Filter
     if(style==='select'){
          return(
                <div id={"select_filter"}>
                    <select onChange={event => onChange(event.target.value)} id={"select_filter"}>
                        <option value='All'>{this.props.translations.all}</option>
                        {options.map(option => (
                            <option value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            )
     }

     // Checkbox Filter
     else if(style==='checkbox' || style==='teams_checkbox'){

          return(
            <div id={"checkbox_filter"}>
                {options.map(option => (
                    <div className={"checkbox_filter_choice"}>
                        <label>
                            <input type={"checkbox"} id={option} onChange={event => onChange(event.target.value)}/>
                            {option}
                        </label>
                    </div>
                ))}
            </div>
          )
     }
  }

  // Get filter method
  getSelectFilterMethod(filter, row, column_name){

      if (filter.value === "All") {
        return true;
      }
      return row[filter.id] !== undefined ? String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase()) : false;
    }

  // Get filter method
  getCheckboxFilterMethod(filter, row, column_name){

      // Get available options
      let options = [];
      for(var i=0; i<this.state.members_data.length; i++){
            if(!options.includes(this.state.members_data[i][column_name])
                && this.state.members_data[i][column_name] !== ''){
                options.push(this.state.members_data[i][column_name]);
            }
      }

      // If option checkbox is checked, add this option
      let checked_checkbox = [];
      for(var j=0; j<options.length; j++){
          let checkbox = document.getElementById(options[j]);
          if (checkbox.checked) {
              checked_checkbox.push(options[j]);
          }
      }

      // If textual search
      if(filter.value !== 'on'){
          return String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
      }
      // If no checkbox checked and no textual seach
      else if(checked_checkbox.length === 0){
          return true
      }
      // If checkbox checked
      return(
          checked_checkbox.includes(row[filter.id] || String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase()))
      );
    }

  // Get filter method
  getCheckboxTeamsFilterMethod(filter, row){

      // Get available options
      let options = this.state.teams_options;

      // If option checkbox is checked, add this option
      let checked_checkbox = [];

      if(document.getElementById("checkbox_filter") !== null) {
          for (var p = 0; p < options.length; p++) {
              let checkbox = document.getElementById(options[p]);
              if (checkbox.checked) {
                  checked_checkbox.push(options[p]);
              }
          }
      }

      // If textual search
      if (filter.value !== 'on') {
          return String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
      }
      // If no checkbox checked and no textual seach
      else if (checked_checkbox.length === 0) {
          return true
      }
      // If checkbox checked contains one of teams
      return (
          checked_checkbox.some(r => row[filter.id].includes(r))
      );
    }

  // Sort a column table asc or desc
  sortTable(column_name, direction){
      let actual_sorting =  {};
      if(direction==='asc'){actual_sorting = {id: column_name, asc: true};}
      else {actual_sorting = {id: column_name, desc: true};}
      this.setState({actual_sorting: actual_sorting})
  }


  /////////////
  /// OTHER ///
  /////////////

  // Onclick, show or hide pop-up, by giving him data
  showPopUp(popup_content){

    let d = document.getElementById("popup");

    if(d.style.visibility === "visible") {
        d.style.visibility = "hidden";
        d.style.opacity = "0";
        d.style.width = "0";
        d.style.height = "0";
        this.setState({popup_content: null});
    }
    else{
        d.style.visibility = "visible";
        d.style.opacity = "1";
        d.style.width = "35%";
        d.style.height = "30%";
        this.setState({popup_content: popup_content});
    }
  }

  hasParent(profile){
      if(profile.value.parents.length > 0){
          // console.log(profile.value.parents[0]);
          return(

                <Popup
                    trigger={<img className={"icon_parents"} src={this.props.SE_URL + "/static/themes/v2/images/frontend/clubs/icon_parents.svg"}/>}
                    closeOnDocumentClick
                    position={"right top"}
                    arrow={false}
                    on={"hover"}
                    offsetX={45}
                >
                    <div>
                        {/*{this.props.translations.parent} 1<br/><br/>*/}
                        <div className={"parents_name"}>{profile.value.parents[0].first_name} {profile.value.parents[0].last_name}</div>
                        <div className={"parents_informations"}>{profile.value.parents[0].email}</div>
                        <div className={"parents_informations"}>{profile.value.parents[0].phone_number}</div>
                    </div>
                 </Popup>
          )
      }
  }

  // Show parent name
  showParentName(parents, parent_nb){
      if(parents.value.length >= parent_nb) {
          return (
              <div className={"cell_element"}>{parents.value[parent_nb-1].first_name} {parents.value[parent_nb-1].last_name}</div>
          );
      }
  }

  // Show parent email
  showParentEmail(parents, parent_nb){
      if(parents.value.length >= parent_nb) {
          return (
              <div className={"cell_element"}>{parents.value[parent_nb-1].email}</div>
          );
      }
  }

  // Show parent phone
  showParentPhone(parents, parent_nb){
      if(parents.value.length >= parent_nb) {
          return (
              <div className={"cell_element"}>{parents.value[parent_nb-1].phone_number}</div>
          );
      }
  }

  // Switch edition mode state
  changeEditionMode = () => {
       this.setState({isEditionMode: !this.state.isEditionMode})
  };

  renderEditable(cellInfo) {

      let members_data = this.state.members_data;

      // Filter here for update data

      // If textual search
      if (this.state.search) {
          members_data = members_data.filter(row => {
            return String(row['first_name']).toLowerCase().includes(this.state.search.toLowerCase()) ||
                   String(row['last_name']).toLowerCase().includes(this.state.search.toLowerCase()) ||
                   String(row['email']).toLowerCase().includes(this.state.search.toLowerCase()) ||
                   String(row['teams']).toLowerCase().includes(this.state.search.toLowerCase()) ||
                   String(row['phone_number']).toLowerCase().includes(this.state.search.toLowerCase())
          });
      }

      // If teams search
      if(this.state.selected_teams.length > 0){
          members_data = members_data.filter(row => {
              for(var i=0; i<this.state.selected_teams.length; i++){
                  if(String(row['teams']).toLowerCase().includes(this.state.selected_teams[i].toLowerCase())){
                      return true
                  }
              }
              return false
          });
      }

      // If edition mode
      if(this.state.isEditionMode) {
          return (
              <div
                  style={{backgroundColor: "#fafafa"}}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => {
                      members_data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                      this.setState({members_data});
                  }}
                  dangerouslySetInnerHTML={{
                      __html: members_data[cellInfo.index][cellInfo.column.id]
                  }}
              />
          );
      }
      // If not edition mode
      else {
          const id = members_data[cellInfo.index].id;
          // If column === email
          if(cellInfo.column.id === 'email'){
              // If status === pending
              if(members_data[cellInfo.index].status === 'pending') {
                  const id = members_data[cellInfo.index].id;
                  return (
                      <div className="email_content">
                          <a href={"/profile/"+id} className={"profile_ref"}>
                              {members_data[cellInfo.index][cellInfo.column.id]}
                          </a>
                          <div className="email_warning">
                                {this.props.translations.account_not_activated}
                          </div>

                          <button className="email_reminder">
                              <a href={"/profile/"+id+"/reminder/"} className={"profile_ref js-popin-form"}>
                                {this.props.translations.reminder}
                              </a>
                          </button>
                      </div>
                  );
              }
              // If no email
              else if(members_data[cellInfo.index].status === 'not_invited'){
                  return (
                      <div className="email_warning">
                          <button className="email_invite">
                              Invite
                          </button>
                      </div>
                  );
              }
              // If email is invalid
              else if(members_data[cellInfo.index].status === 'invalid'){
                  const id = members_data[cellInfo.index].id;
                  return (
                      <div className="email_content">
                          <a href={"/profile/"+id} className={"profile_ref"}>
                              {members_data[cellInfo.index][cellInfo.column.id]}
                          </a>
                          <div className="email_warning">
                              {this.props.translations.invalid_email}
                          </div>

                          <button className="email_correct">
                              <a href={"/profile/"+id+"/reminder/"} className={"profile_ref"}>
                                Correct
                              </a>
                          </button>
                      </div>
                  );
              }
          }

          else if(cellInfo.column.id === 'teams'){
              return (
                  // Change URL to static URL
                  <a href={"/profile/"+id} className={"profile_ref cell_element"}>
                      {members_data[cellInfo.index][cellInfo.column.id].map(team => (
                        <div className={"team_name"}>{team}</div>
                      ))}
                  </a>
              );
          }

          // If column !== email !== teams
          return (
              // Change URL to static URL
              <a href={"/profile/"+id} className={"profile_ref"}>
                  <div className={"cell_element"}>
                      {members_data[cellInfo.index][cellInfo.column.id]}
                  </div>
              </a>
          );
      }
  }

  // Get members data from the API and convert them in state.members_data
  componentDidMount(){
    this.getApiClubMemberList();
    this.getApiSeasonClubList();
    this.getApiTeamClubList();

    // Resize container and page in SportEasy
    try {
        const container = document.getElementById("container");
        container.style.width = "unset";

        const page = document.getElementById("page");
        page.style.width = "100%";
        page.style.padding = "50px";
    }
    catch{
        console.log("No container/page");
    }
  }

  render() {

    this.updateSelectionActionsButtons();

    return(
        <div id={"members_list"}>
          <MembersList ClubMembersList={this}/>
        </div>
    );
  }
}

export default ClubMembersList;
