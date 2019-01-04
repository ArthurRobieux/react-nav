import React, { Component } from 'react';
import './CalendarApp.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class ActionsMenu extends Component {
    constructor() {
      super();
      this.state = {
          buttonListViewImg: "img/listViewDark.svg",
          buttonGridViewImg: "img/gridViewWhite.svg"
      };
    }

    changeView(Calendar, view){
        const buttonListView = document.getElementById('button_list_view');
        const buttonGridView = document.getElementById('button_grid_view');
        if(view === 'list'){
            buttonListView.style.background = '#3cabff';
            buttonGridView.style.background = 'white';
            this.setState({buttonListViewImg: "img/listViewWhite.svg", buttonGridViewImg: "img/gridViewDark.svg"})
        }
        else{
            buttonListView.style.background = 'white';
            buttonGridView.style.background = '#3cabff';
            this.setState({buttonListViewImg: "img/listViewDark.svg", buttonGridViewImg: "img/gridViewWhite.svg"})
        }
        Calendar.setState({calendarView: view});
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

        html2canvas(document.getElementById("calendar")).then(canvas => {
            var doc = new jsPDF();
            doc.text(10, 10, 'Calendrier');
            doc.addImage(canvas, 'PNG', 10, 10, calendarPdfWidth, calendarPdfHeight);
            if(calendarPdfHeight > 280){ // I noticed 365 was the height of my page but for your landscape page it must be lower depending on your unit (pt, or mm or cm etc)
              doc.addPage();
              doc.addImage(canvas, 10, -280, calendarPdfWidth, calendarPdfHeight);
            }
            doc.save('Calendrier.pdf');
        });
    }

    printCalendar(){

        console.log(document.getElementById("calendar"));

        const calendarDivWidth = document.getElementById("calendar").clientWidth;
        const calendarDivHeight = document.getElementById("calendar").clientHeight;
        const calendarPdfWidth = 190;
        const calendarPdfHeight = calendarDivHeight * calendarPdfWidth / calendarDivWidth;

        html2canvas(document.getElementById("calendar")).then(canvas => {
            var doc = new jsPDF();
            doc.text(10, 10, 'Calendrier');
            doc.addImage(canvas, 'PNG', 10, 10, calendarPdfWidth, calendarPdfHeight);
            if(calendarPdfHeight > 280){ // I noticed 365 was the height of my page but for your landscape page it must be lower depending on your unit (pt, or mm or cm etc)
              doc.addPage();
              doc.addImage(canvas, 10, -280, calendarPdfWidth, calendarPdfHeight);
            }
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
                    <img src={'img/iconAddEvents.svg'} alt={'iconAddEvents'} className={"action_image"}/>
                </button>
              </a>

              {/*Export members list*/}
                <button className={"action_button"} onClick={() => this.exportCalendar()}>
                    <img src={'img/iconExport.svg'} alt={'iconExport'} className={"action_image"}/>
                </button>

              {/*Print members list*/}
                <button className={"action_button"} onClick={() => this.printCalendar()}>
                    <img src={'img/iconPrint.svg'} alt={'iconPrint'} className={"action_image"}/>
                </button>

              {/*Show list calendar*/}
              <button id={"button_list_view"} className={"action_button calendar_view_button"} onClick={() => this.changeView(Calendar, "list")}>
                  <img src={this.state.buttonListViewImg} alt={'listView'} className={"action_image"}/>
              </button>

              {/*Show grid calendar*/}
              <button id={"button_grid_view"} className={"action_button calendar_view_button"} onClick={() => this.changeView(Calendar, "grid")}>
                  <img src={this.state.buttonGridViewImg} alt={'gridView'} className={"action_image"}/>
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
