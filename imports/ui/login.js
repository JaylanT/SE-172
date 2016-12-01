import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './login.html';

Template.login.events({
    'submit form'(e, t) {
        // prevent page reload on submit event
        e.preventDefault();

        const email = t.find('#email').value.toLowerCase(),
            password = t.find('#password').value;

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
                // Accounts.onLogin below runs before this callback
                FlowRouter.go('/');
            }
        });
    }
});