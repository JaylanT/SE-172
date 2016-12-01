import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './signup.html';

Template.signup.events({
    'submit form'(e, t) {
        // prevent page reload on submit event
        e.preventDefault();

        // grab all fields and their values
        const firstName = t.find('#first-name').value.trim(),
            lastName = t.find('#last-name').value.trim(),
            password = t.find('#password').value.trim(),
            confirmPassword = t.find('#confirm-password').value.trim(),
            email = t.find('#email').value.toLowerCase().trim();

        // if HTML5 required doesn't work, these checks should catch empty fields
        if (firstName === '' || lastName === '' || password === '' || confirmPassword === '' || email === '') {
            Materialize.toast('Please complete all fields!', 4000, 'toast-error');
            return;
        }

        if (password.length < 6) {
            Materialize.toast('Password must be at least 6 characters long!', 4000, 'toast-error');
            return;
        }

        if (password !== confirmPassword) {
            Materialize.toast('Passwords do not match!', 4000, 'toast-error');
            return;
        }

        // user object
        const user = {
            email: email,
            password: password,
            profile: {
                firstName: firstName,
                lastName: lastName
            }
        };

        Accounts.createUser(user, err => {
            if (err) {
                if (err.message === 'Email already exists. [403]') {
                    Materialize.toast('Email already in use!', 4000, 'toast-error');
                } else if (err.message === 'Login forbidden [403]') {
                    // Registration is successful. Error due to login forbidden until verified.
                    Materialize.toast('Verification sent. Please check your email.', 4000, 'toast-success');
                    FlowRouter.go('/');
                } else {
                    Materialize.toast('We\'re sorry, but something went wrong. Please try again.', 4000, 'toast-error');
                    throw new Error(err.message);
                }
            } else {
                // Not sure if necessary
                Materialize.toast('Verification sent. Please check your email.', 4000, 'toast-success');
                FlowRouter.go('/');
            }
        });
    }
});