import React, { Component } from 'react';
import './ClubMembersList.css';
import Popup from "reactjs-popup";
import PopUp from "./PopUp";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import ReactTable from "react-table";
import withFixedColumns from "../lib/react-table-hoc-fixed-columns";
import ActionsMenu from "./ActionsMenu";

const CheckboxTable = checkboxHOC(ReactTable);
const ReactTableFixedColumns = withFixedColumns(CheckboxTable);


const getTheadThProps = (state, rowInfo, column) => {
 return {
    onClick: (e) => {
         showHideFilters(column.id);
       }
    }
};


function showHideFilters(column_name){

  const d = document.getElementById("filters_"+column_name);

  if(d !== null) {
      if (d.style.opacity === '0.95') {
          d.style.opacity = '0';
          d.style.display = 'none';
      }
      else {
          d.style.opacity = '0.95';
          d.style.display = 'block';
      }
      document.addEventListener('click', function (event) {
          var isClickInside = d.contains(event.target);
          if (!isClickInside && d.style.display === 'block') {
              d.style.opacity = '0';
              d.style.display = 'none';
          }
      }, true);

  }
  return false;
}

class MembersList extends Component {

  // Show Table if there is data in the state.members_data
  showTable(ClubMembersList){
      if(ClubMembersList.state.members_data.length !== 0){
          // Get functions and checkbox props
          const { toggleSelection, toggleAll, isSelected } = ClubMembersList;
          const { selectAll } = ClubMembersList.state;
          const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: "checkbox",
          };

          // Filter data with global search bar
          let data = ClubMembersList.state.members_data;

          if (ClubMembersList.state.search) {
              data = data.filter(row => {
                return String(row['first_name']).toLowerCase().includes(ClubMembersList.state.search.toLowerCase()) ||
                       String(row['last_name']).toLowerCase().includes(ClubMembersList.state.search.toLowerCase()) ||
                       String(row['email']).toLowerCase().includes(ClubMembersList.state.search.toLowerCase()) ||
                       String(row['teams']).toLowerCase().includes(ClubMembersList.state.search.toLowerCase()) ||
                       String(row['phone_number']).toLowerCase().includes(ClubMembersList.state.search.toLowerCase())
              });
          }

          // If teams search
          if(ClubMembersList.state.selected_teams.length > 0){
              data = data.filter(row => {
                  for(var i=0; i<ClubMembersList.state.selected_teams.length; i++){
                      if(String(row['teams']).toLowerCase().includes(ClubMembersList.state.selected_teams[i].toLowerCase())){
                          return true
                      }
                  }
                  return false
              });
          }

          const page_size = data.length;

          return(
              <div>
                    <ReactTableFixedColumns ref={r => (ClubMembersList.checkboxTable = r)} data={data}
                                 noDataText={ClubMembersList.props.translations.no_data}
                                 pageSize={page_size} showPagination={false} columns={ClubMembersList.state.columns}
                                 className="-highlight react_table" filterable {...checkboxProps}
                                 defaultFilterMethod={(filter, row) => row[filter.id] !== undefined
                                 ? String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase()) : false}
                                 sorted={[ClubMembersList.state.actual_sorting]} getTheadThProps={getTheadThProps}
                  >
                        {(state, makeTable, instance) => {
                            const {sortedData} = state;
                            let totalRecords = 0;
                            if (sortedData && sortedData.length > 0) {
                                totalRecords = sortedData.length;
                            }

                            // console.log(sortedData);
                            // this.setState({sortedData: sortedData});

                            return (
                                <div>
                                    <h3 id={"members_title"}>{ClubMembersList.props.translations.members} ({totalRecords})</h3>
                                    <ActionsMenu ClubMembersList={ClubMembersList}/>
                                    {makeTable()}
                                </div>
                                );
                        }}
                    </ReactTableFixedColumns>
              </div>
          )
      }
      else{
          console.log("No members_data!");
          return(
              <div>
                  <h3 id={"members_title"}>{ClubMembersList.props.translations.members}</h3>
                  <ActionsMenu ClubMembersList={ClubMembersList}/>
                  <div className="lds-ripple">
                      <div></div>
                      <div></div>
                  </div>
              </div>);
      }
  }

  render() {

    const ClubMembersList = this.props.ClubMembersList;
    return(

        <div>
            {this.showTable(ClubMembersList)}
            <PopUp popup_content={ClubMembersList.state.popup_content} SE_URL={ClubMembersList.props.SE_URL}/>
        </div>


    );

  }
}

export default MembersList;
