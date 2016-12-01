import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './signup.html';

Template.signup.events({
    'submit form'(event) {
        // prevent page reload on submit event
        event.preventDefault();
        const target = event.target;

        // grab all fields and their values
        const firstName = target.firstName.value.trim(),
            lastName = target.lastName.value.trim(),
            password = target.password.value,
            confirmPassword = target.confirmPassword.value,
            email = target.email.value.toLowerCase().trim();

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
                } else {
                    Materialize.toast('Something went wrong. Please try again.', 4000, 'toast-error');
                    throw new Error(err.message);
                }
            } else {
                $('#signup-modal').closeModal();
                Materialize.toast('Account created!', 4000, 'toast-success');
            }
        });
    },
    'click #login-link'() {
        $('#login-modal').openModal();
    }
});