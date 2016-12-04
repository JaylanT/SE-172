import { Accounts } from 'meteor/accounts-base';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { Materialize } from 'meteor/materialize:materialize'

import './signup.html';

Template.signup.onCreated(function () {
    this.loading = new ReactiveVar();
});

Template.signup.helpers({
    loading() {
        return Template.instance().loading.get();
    }
});

Template.signup.events({
    'submit form'(event, template) {
        // prevent page reload on submit event
        event.preventDefault();
        const target = event.target;

        // grab all fields and their values
        const firstName = target.firstName.value.trim(),
            lastName = target.lastName.value.trim(),
            password = target.password.value,
            confirmPassword = target.confirmPassword.value,
            email = target.email.value.toLowerCase().trim();

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

        template.loading.set(true);

        Accounts.createUser(user, err => {
            if (err) {
                template.loading.set(false);
                if (err.message === 'Email already exists. [403]') {
                    Materialize.toast('Email already in use!', 4000, 'toast-error');
                } else {
                    Materialize.toast('Something went wrong. Please try again.', 4000, 'toast-error');
                    throw new Error(err.message);
                }
            } else {
                target.firstName.value = '';
                target.firstName.className = 'validate';
                target.lastName.value = '';
                target.lastName.className = 'validate';
                target.password.value = '';
                target.password.className = 'validate';
                target.confirmPassword.value = '';
                target.confirmPassword.className = 'validate';
                target.password.value = '';
                target.password.className = 'validate';
                target.email.value = '';
                target.email.className = 'validate';

                $('#signup-modal').closeModal({
                    completed: setTimeout(() => {
                        template.loading.set(false);
                    }, 1000)
                });

                Materialize.toast('Account created!', 4000, 'toast-success');
            }
        });
    },
    'click #login-link'() {
        $('#login-modal').openModal();
        $('#email').focus();
    }
});