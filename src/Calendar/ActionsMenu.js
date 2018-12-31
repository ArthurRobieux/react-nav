import React, { Component } from 'react';
import './CalendarApp.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class ActionsMenu extends Component {

    changeView(Calendar, view){
        Calendar.setState({calendarView: view})
    }

    changeSelectedSeason(Calendar, season){
        Calendar.setState({selectedSeason: season})
    }

    exportCalendar(){

        console.log(document.getElementById("calendar"));

        const calendarDivWidth = document.getElementById("calendar").clientWidth;
        const calendarDivHeight = document.getElementById("calendar").clientHeight;
        const calendarPdfWidth = 190;
        const calendarPdfHeight = calendarDivHeight * calendarPdfWidth / calendarDivWidth;

        console.log(calendarPdfWidth);
        console.log(calendarPdfHeight);

        html2canvas(document.getElementById("calendar")).then(canvas => {
            var doc = new jsPDF();
            doc.text(10, 10, 'Calendrier');
            doc.addImage(canvas, 'PNG', 10, 20, calendarPdfWidth, calendarPdfHeight);
            doc.save('Calendrier.pdf');
        });
    }

    printCalendar(){

        console.log(document.getElementById("calendar"));

        html2canvas(document.getElementById("calendar")).then(canvas => {
            var doc = new jsPDF();
            doc.text(10, 10, 'Calendrier');
            doc.addImage(canvas, 'PNG', 10, 20, 190, 160);
            doc.autoPrint();
            doc.output('dataurlnewwindow');
        });
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
                <button className={"action_button"} onClick={() => this.exportCalendar()}>
                    Export
                </button>

              {/*Print members list*/}
                <button className={"action_button"} onClick={() => this.printCalendar()}>
                    Print
                </button>

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
