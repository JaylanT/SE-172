import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import './nav.html';

Template.nav.onRendered(() => {
    $(".button-collapse").sideNav({
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });
    $(".dropdown-button").dropdown();
});

Template.nav.events({
    'click #login'() {
        $('#login-modal').openModal();
        $('#email').focus();
    }
});