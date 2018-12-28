import React, { Component } from 'react';
import checkboxHOC from "react-table/lib/hoc/selectTable";
import ReactTable from "react-table";

import './CalendarApp.css';
import 'react-table/react-table.css'


const CheckboxTable = checkboxHOC(ReactTable);

class CalendarList extends Component {

    showEventOpponents(opponents){

        var score_color = "black";

        if(opponents.value.opponent_left.is_current_team){
            if(opponents.value.opponent_left.match_outcome === "victory"){
                score_color = "green";
            }
            else if(opponents.value.opponent_left.match_outcome === "defeat"){
                score_color = "red";
            }
        }
        else{
            if(opponents.value.opponent_left.match_outcome === "victory"){
                score_color = "red";
            }
            else if(opponents.value.opponent_left.match_outcome === "defeat"){
                score_color = "green";
            }
        }

        return(
            <div className={"opponents"}>
                <div className={"opponent"}>
                    {opponents.value.opponent_left.short_name}
                </div>
                <div className={"opponents_score"} style={{color: score_color}}>
                    {opponents.value.opponent_left.score} - {opponents.value.opponent_right.score}
                </div>
                <div className={"opponent"}>
                    {opponents.value.opponent_right.short_name}
                </div>
            </div>
        )
    }

    render() {

        const Calendar = this.props.Calendar;
        const pageSize = Calendar.filteredEvents().length;

        return(

            <div>

                <ReactTable
                  data={Calendar.filteredEvents()}
                  columns={[
                        {
                          Header: "Date",
                          accessor: "date"
                        },
                        {
                          Header: "Type",
                          accessor: "type",
                          width: 150,
                        },
                        {
                          Header: "ID",
                          accessor: "number",
                          width: 50,
                        },
                        {
                          Header: "Equipe",
                          accessor: "team",
                          width: 125,
                          Cell: team => (<div className={"team_name"} style={{background: team.value.color}}>{team.value.name}</div>),
                        },
                        {
                          Header: "Evénements",
                          accessor: "opponents",
                          Cell: opponents => (this.showEventOpponents(opponents)),

                        },
                        {
                          Header: "Saison",
                          accessor: "seasonName",
                          width: 100,
                        },
                      ]
                    }
                  pageSize={pageSize} showPagination={false}
                  className="-highlight"
                />

            </div>

        );

  }


}

export default CalendarList;
