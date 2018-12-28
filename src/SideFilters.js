import React, { Component } from 'react';
import './CalendarApp.css';

class SideFilters extends Component {

    filterTeams(Calendar){

      const teamsList = Calendar.state.teamsList;

      // If option checkbox is checked, add this option
      let checked_checkbox = [];

      for (var i = 0; i < teamsList.length; i++) {
          let checkbox = document.getElementById("team_selection_" + teamsList[i].id);
          if (checkbox.checked) {
              checked_checkbox.push(teamsList[i].id);
          }
      }
      Calendar.setState({selectedTeams: checked_checkbox});
    }


    filterEventTypes(Calendar){

      const eventTypesList = Calendar.state.eventTypesList;

      // If option checkbox is checked, add this option
      let checked_checkbox = [];

      for (var i = 0; i < eventTypesList.length; i++) {
          let checkbox = document.getElementById("team_selection_" + eventTypesList[i]);
          if (checkbox.checked) {
              checked_checkbox.push(eventTypesList[i]);
          }
      }
      Calendar.setState({selectedEventTypes: checked_checkbox});
    }

    render() {

        const Calendar = this.props.Calendar;

        return(

            <div>

              <div id={"side_filter"}>
                  <div className={"side_filter_title"}>
                      Types
                  </div>
                  <hr/>
                    {Calendar.state.eventTypesList.map(eventType => (
                        <div>
                            <label>
                                    <input className={"checkbox_filter"} type={"checkbox"} id={"team_selection_"+ eventType}
                                           onChange={event => this.filterEventTypes(Calendar)}/>
                                    {eventType}
                            </label>
                        </div>
                    ))}
              </div>

              <br/>

              <div id={"side_filter"}>
                  <div className={"side_filter_title"}>
                    Equipes
                  </div>
                  <hr/>
                    {Calendar.state.teamsList.map(team => (
                        <div>
                            <label>
                                    <input className={"checkbox_filter"} type={"checkbox"} id={"team_selection_"+ team.id}
                                           onChange={event => this.filterTeams(Calendar)}
                                           style={{background:team.color}}/>
                                    {team.name}
                            </label>
                        </div>
                    ))}
              </div>

            </div>

        );

  }


}

export default SideFilters;
