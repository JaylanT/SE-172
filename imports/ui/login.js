import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './login.html';

Template.login.events({
    'submit form'(event) {
        // prevent page reload on submit event
        event.preventDefault();
        const target = event.target;

        const email = target.email.value.toLowerCase(),
            password = target.password.value;

        if (email === '' || password === '') {
            Materialize.toast('Please complete all fields!', 4000, 'toast-error');
            return;
        }

        Meteor.loginWithPassword(email, password, err => {
            if (err) {
                Materialize.toast('You have entered an invalid email or password. Please try again.', 4000, 'toast-error');
            } else {
                $('#login-modal').closeModal();
            }
        });
    },
    'click #signup-link'() {
        $('#signup-modal').openModal();
        $('#first-name').focus();
    }
});