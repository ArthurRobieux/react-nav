import React, { Component } from "react";
import events from "./events";
import BigCalendar from "react-big-calendar";
import './CalendarApp.css';
import moment from "moment";
import Chance from "chance";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ActionsMenu from './ActionsMenu';
import SideFilters from './SideFilters';
import CalendarList from './CalendarList';
import clubEvents from "./clubEvents.json"

moment.locale("en");

const localizer = BigCalendar.momentLocalizer(moment) ;

const chance = new Chance();

function getData(testData) {
  const data = testData.map(item => {
    // using chancejs to generate guid
    // shortid is probably better but seems to have performance issues
    // on codesandbox.io
    const _id = chance.guid();
    return {
      _id,
      ...item
    };
  });
  return data;
}

class CalendarApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            activePopup: false,
            selectedSlots: {slots: []},
            teamsList: [],
            eventTypesList: [],
            seasonsList: [],
            selectedTeams: [],
            selectedEventTypes: [],
            selectedSeason: "",
            calendarView: "grid",
        }
    }

    eventStyleGetter(event, start, end, isSelected) {
        var backgroundColor = event.hexColor;
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '3px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    }

    // Teams events functions

    // Get members data from API and save them in state
    getApiEventsList(){

        const API_URL = 'http://api.local.sporteasy.net:8000/v2.1/teams/6/events/';

        fetch(API_URL, {
            method: "GET",
            credentials: 'include',
        })
        .then(response =>
            response.json()
        )
        .then(json_response =>
            this.createEventsFromJson(json_response)
        )
    }

    createEventsFromJson(json_response){
        // console.log(json_response);
        var newEvent;
        var events = [];

        for(var i=0; i<json_response.results.length; i++){
            // console.log(json_response.results[i]);

            newEvent = {
              allDay: true,
              endDate: new Date(json_response.results[i].start_at),
              startDate: new Date(json_response.results[i].start_at),
              title: <div>
                         <div className={"event"}>Event {json_response.results[i].id}</div>
                         <div className={"info_popup"}>{json_response.results[i].category.localized_name}</div>
                     </div>,
              hexColor: 'lightsalmon',
            };
            events.push(newEvent);
        }
        this.setState({events: getData(events)});
        console.log(this.state.events);
    }

    // Club Events functions

    // Create events data and get teams / eventTypes Lists
    createClubEventsFromJson() {
        // console.log(clubEvents);

        var newEvent;
        var events = [];

        var newTeam = {};
        var teamsList = [];

        var newType = {};
        var eventTypesList = [];

        var newSeason = {};
        var seasonsList = [];

        const colors = ["lightskyblue", "lightseagreen", "lightcoral", "lightpink", "lightsalmon", "lightgreen", "lightblue"];

        // For each team
        for (var i = 0; i < clubEvents.teams.length; i++) {

            // Add team to teamsList
            newTeam = {id:clubEvents.teams[i].id, name: clubEvents.teams[i].name, color: colors[i]};
            teamsList.push(newTeam);

            // For each event
            for (var j = 0; j < clubEvents.teams[i].events.length; j++) {

                // Add eventType to eventTypesList
                newType = clubEvents.teams[i].events[j].type;
                if (!eventTypesList.includes(newType)){
                    eventTypesList.push(newType);
                }

                // Add season to seasonsList
                newSeason = clubEvents.teams[i].events[j].season.name;
                if (!seasonsList.includes(newSeason)){
                    seasonsList.push(newSeason);
                }

                // Get current season
                // if (clubEvents.teams[i].events[j].season.current){
                //     this.setState({selectedSeason: clubEvents.teams[i].events[j].season.name});
                // }

                clubEvents.teams[i].color = colors[i];

                let endDate;

                if(clubEvents.teams[i].events[j].end_at !== undefined){
                    endDate = new Date(clubEvents.teams[i].events[j].end_at);
                }
                else{
                    endDate = new Date(clubEvents.teams[i].events[j].start_at);
                }

                // Create new event
                newEvent = {
                    allDay: false,
                    endDate: endDate,
                    startDate: new Date(clubEvents.teams[i].events[j].start_at),
                    title: <div>
                                <div className={"event"}>{clubEvents.teams[i].name} ({clubEvents.teams[i].events[j].id})</div>
                                <div className={"info_popup"}>{clubEvents.teams[i].events[j].type}</div>
                            </div>,
                    hexColor: colors[i],
                    teamId: clubEvents.teams[i].id,
                    team: clubEvents.teams[i],
                    type: clubEvents.teams[i].events[j].type,
                    number: clubEvents.teams[i].events[j].id,
                    date: String(clubEvents.teams[i].events[j].start_at),
                    seasonName: clubEvents.teams[i].events[j].season.name,
                    opponents: {opponent_left: clubEvents.teams[i].events[j].opponent_left,
                             opponent_right: clubEvents.teams[i].events[j].opponent_right},

                };
                events.push(newEvent);
            }
        }
        this.setState({events: getData(events), teamsList: teamsList, eventTypesList: eventTypesList, seasonsList: seasonsList});
    }

    // Filter events if there is a filter
    filteredEvents(){

        var filteredEvents = [];
        var seasonFilteredEvents = this.state.events;

         // If season filter
        if(this.state.selectedSeason !== "") {
            seasonFilteredEvents = [];
            for (var p = 0; p < this.state.events.length; p++) {
                if (this.state.selectedSeason === this.state.events[p].seasonName) {
                    seasonFilteredEvents.push(this.state.events[p]);
                }
            }
            // If only season filter
            if (this.state.selectedTeams.length === 0 && this.state.selectedEventTypes.length === 0){
                return (seasonFilteredEvents)
            }
        }

        // If 2 filters (teams + types)
        if(this.state.selectedTeams.length > 0 && this.state.selectedEventTypes.length > 0){
            for(var i=0; i<this.state.events.length; i++){
                if(this.state.selectedTeams.includes(this.state.events[i].teamId) && this.state.selectedEventTypes.includes(this.state.events[i].type)){
                    filteredEvents.push(this.state.events[i]);
                }
            }
            return(seasonFilteredEvents.filter(value => -1 !== filteredEvents.indexOf(value)));
        }
        // If only team filter
        else if(this.state.selectedTeams.length > 0){
            for(var j=0; j<this.state.events.length; j++){
                if(this.state.selectedTeams.includes(this.state.events[j].teamId)){
                    filteredEvents.push(this.state.events[j]);
                }
            }
            return(seasonFilteredEvents.filter(value => -1 !== filteredEvents.indexOf(value)));
        }
        // If only type filter
        else if(this.state.selectedEventTypes.length > 0){
            for(var k=0; k<this.state.events.length; k++){
                if(this.state.selectedEventTypes.includes(this.state.events[k].type)){
                    filteredEvents.push(this.state.events[k]);
                }
            }
            return(seasonFilteredEvents.filter(value => -1 !== filteredEvents.indexOf(value)));
        }
        // If no filter
        return(this.state.events);
    }

    // Show Grid calendar or List calendar
    showCalendar(){

        if(this.state.calendarView === "grid") {
            return (
                <div id={"grid_calendar"}>
                    <BigCalendar
                        localizer={localizer}
                        events={this.filteredEvents()}
                        startAccessor="startDate"
                        endAccessor="endDate"
                        eventPropGetter={(this.eventStyleGetter)}
                        selectable={true}
                        onSelectEvent={event => console.log(event)}
                        onSelectSlot={(slot) => this.setState({activePopup: true, selectedSlots: slot})}
                        views={['month', 'week', 'day']}
                    />
                    {this.showSlot()}
                </div>
            )
        }
        else{
            return(
                <div id={"list_calendar"}>
                    <CalendarList Calendar={this}/>
                </div>
            )
        }
    }

    // Show clicked cell date
    showSlot(){
        // http://as-rocknroll.local.sporteasy.net:8000/event/new/all/?date=2018-12-20
        // window.location.reload();

        if(this.state.selectedSlots.slots.length > 0) {
            const slot = String(this.state.selectedSlots.slots[0]).split(" ");
            const day = slot[2];
            const month = slot[1];
            const year = slot[3];
            return (
                <div>
                    Click : {day} {month} {year}
                </div>
            )
        }
    }

    componentDidMount(){
        // this.getApiEventsList();
        this.createClubEventsFromJson();
    }

    render() {

        // console.log(this.state.events);
        // console.log(this.state.selectedTeams);

        return (
            <div id={"calendarApp"}>

                <h3 id={"events_title"}>Evénements</h3>

                <ActionsMenu Calendar={this}/>

                <div id={"side_filters"}>
                    <SideFilters Calendar={this}/>
                </div>

                <div id={"calendar"}>
                    {this.showCalendar()}
                </div>



            </div>
        );
    }
}

export default CalendarApp;