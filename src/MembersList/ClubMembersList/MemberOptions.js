import React, { Component } from 'react';
import './ClubMembersList.css';
import Popup from "reactjs-popup";

class MemberOptions extends Component {

  // Show selected lines
  showMember(ClubMemberList, id){

    // Get actual member
    const member = ClubMemberList.state.members_data.filter(function(item){return item['id']===id})[0];

    return(
        <div className={"list_selected_members"}>
          <div className={"member"}>
              <img src={member.profile.avatar["120x120"]} alt={member.profile.avatar["120x120"]} className={"avatar"}/>
              {member.first_name} {member.last_name}
          </div>
        </div>
    )
  };

  render() {

    const ClubMembersList = this.props.ClubMembersList;

    return(
          <div>
              <div id={"member_"+this.props.id+"_options"} className={"members_options"}>

                  <Popup
                    trigger={<button className="settings_button">...</button>}
                    closeOnDocumentClick
                    position={"left top"}
                  >
                    <span className={"popup-modal"}>
                            <div className={"member_option"}>
                                <a className={"profile_ref js-popin-form"}
                                    href={"/members/board/" + this.props.id + "/update/" }>
                                        {ClubMembersList.props.translations.update_office_presence}
                                </a>
                            </div>

                            <div className={"member_option"}>
                                <a className={"profile_ref js-popin-form"}
                                   href={"/profile/parents/" + this.props.id + "/create/roster/" }>
                                        {ClubMembersList.props.translations.add_a_parent}
                                </a>
                            </div>

                            <Popup
                                trigger={<div className={"member_option js-popin-form warning"}>
                                    {ClubMembersList.props.translations.delete_from_club}
                                </div>}
                                closeOnDocumentClick
                                modal
                            >

                              <div className={"popup-modal-content"}>

                                  <h3>{ClubMembersList.props.translations.delete_players_from_club}</h3>

                                  {ClubMembersList.props.translations.delete_from_club_confirmation}
                                  <br/><br/>
                                  {this.showMember(ClubMembersList, this.props.id)}
                                  <br/>
                                  <button className={"action_button"}
                                      onClick={() => ClubMembersList.deleteAPIClubMember([this.props.id])}>
                                      {ClubMembersList.props.translations.delete_from_club}
                                  </button>

                              </div>

                            </Popup>
                    </span>
                 </Popup>
              </div>
          </div>
      )

  }
}

export default MemberOptions;
