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
    },
    'click #search-btn'() {
        $('#navbar-links').fadeOut(100, function() {
            $('#search-bar').show();
            $('#search').focus();
        });
    },
    'blur #search'() {
        $('#search-bar').fadeOut(200);
        $('#navbar-links').fadeIn(200)
    },
    'submit #search-bar'(event) {
        event.preventDefault();

        const target = event.target;

        const query = target.search.value.trim();

        target.search.blur();

        FlowRouter.go('/search', {}, {q: query});
    }
});