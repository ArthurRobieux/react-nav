import React, { Component } from 'react';
import './CalendarApp.css';

class ActionsMenu extends Component {

    changeView(Calendar, view){
        Calendar.setState({calendarView: view})
    }

    changeSelectedSeason(Calendar, season){
        Calendar.setState({selectedSeason: season})
    }

    render() {

        const Calendar = this.props.Calendar;

        return(

          <div id={"actions_menu"}>

              {/*Add an event*/}
              <a className={"action_link"} href={"/members/invite/"}>
                <button className={"action_button add_a_member_button"}>
                    Ajouter un évenement
                </button>
              </a>

              {/*Export members list*/}
              <a href={"/members/export/"}>
                <button className={"action_button"}>
                    Export
                </button>
              </a>

              {/*Show grid calendar*/}
              <button className={"action_button calendar_view_button"} onClick={() => this.changeView(Calendar, "grid")}>
                  Grid
              </button>

              {/*Show list calendar*/}
              <button className={"action_button calendar_view_button"} onClick={() => this.changeView(Calendar, "list")}>
                  List
              </button>

              {/*/!*General Filter*!/*/}
              {/*<input className={"action_filter"} type={"text"} placeholder={"Rechercher.."}/>*/}

              {/*Seasons Filter*/}
              <select onChange={e => this.changeSelectedSeason(Calendar, e.target.value)} className={"select_season"}>
                    <option value="">Toutes les saisons</option>
                    {Calendar.state.seasonsList.map(season => (
                        <option value={season}>Saison : {season}</option>
                    ))}
              </select>
          </div>

        );

  }


}

export default ActionsMenu;
