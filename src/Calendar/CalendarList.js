import React, { Component } from 'react';
import checkboxHOC from "react-table/lib/hoc/selectTable";
import ReactTable from "react-table";

import withFixedColumns from "./lib/react-table-hoc-fixed-columns";
import './CalendarApp.css';
import 'react-table/react-table.css'
import Popup from "reactjs-popup";


const CheckboxTable = checkboxHOC(ReactTable);
const ReactTableFixedColumns = withFixedColumns(CheckboxTable);

class CalendarList extends Component {
    constructor() {
      super();
      this.state = {
          selection: [],
          selectAll: false
      };
    }


      toggleSelection = (key, shift, row) => {
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

      toggleAll = () => {
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
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

      isSelected = key => {
        return this.state.selection.includes(key);
      };

      logSelection = () => {
        console.log("selection:", this.state.selection);
      };


  // Show general options with checkbox
  showGeneralOptions(){
      return(
          <Popup trigger={<button className="selection_action_button settings_button">...</button>}
                                        closeOnDocumentClick
                                        position={"left top"}
                                        >

            <div className={"events_option"}>Action 1 ({this.state.selection.length})</div>
            <div className={"events_option"}>Action 2 ({this.state.selection.length})</div>

          </Popup>
      )
  }

  // Show specifics options with checkbox
  showSpecificOptions(){
      return(
          <Popup trigger={<button className="settings_button">...</button>}
                                        closeOnDocumentClick
                                        position={"left top"}
                                        >

            <div className={"events_option"}>Action 1</div>
            <div className={"events_option"}>Action 2</div>
            <div className={"events_option"}>Action 3</div>

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

        const { toggleSelection, toggleAll, isSelected, logSelection } = this;
        const { selectAll } = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: "checkbox",
        };

        this.updateSelectionActionsButtons();

    return(

            <div>
                <ReactTableFixedColumns
                  ref={r => (this.checkboxTable = r)}
                  data={Calendar.filteredEvents()}
                  columns={[
                        {
                          Header: "Date",
                          accessor: "date",
                            width: 200,
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
                          width: 150,
                          Cell: team => (<div className={"team_name"} style={{background: team.value.color}}>{team.value.name}</div>),
                        },
                        {
                          Header: "Evénements",
                          accessor: "opponents",
                          width: 250,
                          Cell: opponents => (this.showEventOpponents(opponents)),

                        },
                        {
                          Header: "Saison",
                          accessor: "seasonName",
                          width: 150,
                        },
                          {
                            Header: () => (this.showGeneralOptions()),
                            fixed: 'right',
                            accessor: 'id',
                            width: 40,
                            filterable: false,
                            sortable: false,
                            className: "center_element",
                            resizable: false,
                            Cell: id => (this.showSpecificOptions()),
                          },
                      ]
                    }
                  pageSize={pageSize} showPagination={false}
                  className="-highlight"
                  {...checkboxProps}
                />

            </div>

        );

  }


}

export default CalendarList;
