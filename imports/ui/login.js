import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './login.html';

Template.login.events({
    'submit form'(event, t) {
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
                if (err.reason === 'Login forbidden') {
                    Materialize.toast('Account not yet verified. Please check your email.', 4000, 'toast-error');
                } else {
                    Materialize.toast('You have entered an invalid email or password. Please try again.', 4000, 'toast-error');
                }
            } else {
                $('#login-modal').closeModal();
            }
        });
    },
    'click #signup-link'(event) {
        $('#signup-modal').openModal();
    }
});