import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import TeamMembersList from './TeamMembersList/TeamMembersList';
import ClubMembersList from './ClubMembersList/ClubMembersList';

const root = document.getElementById("root");

const team_id = root.dataset.team_id;
const club_id = root.dataset.club_id;

let translations = {};

translations['parent'] = root.dataset.parent;
translations['account_not_activated'] = root.dataset.account_not_activated;
translations['invalid_email'] = root.dataset.invalid_email;
translations['reminder'] = root.dataset.reminder;
translations['search'] = root.dataset.search;
translations['add_a_member'] = root.dataset.add_a_member;
translations['export'] = root.dataset.export;
translations['affect_to_team'] = root.dataset.affect_to_team;
translations['delete_from_club'] = root.dataset.delete_from_club;
translations['profile'] = root.dataset.profile;
translations['infos'] = root.dataset.infos;
translations['add_a_parent'] = root.dataset.add_a_parent;
translations['update_office_presence'] = root.dataset.update_office_presence;
translations['delete_from_club_confirmation'] = root.dataset.delete_from_club_confirmation;
translations['no_data'] = root.dataset.no_data;
translations['all'] = root.dataset.all;
translations['ascending'] = root.dataset.ascending;
translations['descending'] = root.dataset.descending;
translations['choose_a_team'] = root.dataset.choose_a_team;
translations['team_assignation_confirmation'] = root.dataset.team_assignation_confirmation;
translations['assign_members'] = root.dataset.assign_members;
translations['assign_players_to_team'] = root.dataset.assign_players_to_team;
translations['delete_players_from_club'] = root.dataset.delete_players_from_club;
translations['members'] = root.dataset.members;
translations['order'] = root.dataset.order;

const API_URL = 'http://api.local.sporteasy.net:8000';
const SE_URL = 'http://cdn.local.sporteasy.net:8000';


class MembersListApp extends React.Component {

    render() {
        if(team_id !== undefined) {
            return (
                <TeamMembersList team_id={team_id}/>
            );
        }
        else if(club_id !== undefined){
            return (
                <ClubMembersList club_id={club_id} translations={translations} API_URL={API_URL} SE_URL={SE_URL}/>
            )
        }
    }
}

export default MembersListApp;