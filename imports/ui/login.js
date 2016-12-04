import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { Materialize } from 'meteor/materialize:materialize'

import './login.html';

Template.login.onCreated(function () {
    this.loading = new ReactiveVar();
});

Template.login.helpers({
    loading() {
        return Template.instance().loading.get();
    }
});

Template.login.events({
    'submit form'(event, template) {
        // prevent page reload on submit event
        event.preventDefault();
        const target = event.target;

        const email = target.email.value.toLowerCase().trim(),
            password = target.password.value;

        if (email === '' || password === '') {
            Materialize.toast('Please complete all fields!', 4000, 'toast-error');
            return;
        }

        template.loading.set(true);

        Meteor.loginWithPassword(email, password, err => {
            if (err) {
                template.loading.set(false);
                Materialize.toast('You have entered an invalid email or password. Please try again.', 4000, 'toast-error');
            } else {
                target.email.value = '';
                target.email.className = 'validate';
                target.password.value = '';
                target.password.className = 'validate';

                $('#login-modal').closeModal({
                    completed: setTimeout(() => {
                        template.loading.set(false);
                    }, 1000)
                });
            }
        });
    },
    'click #signup-link'() {
        $('#signup-modal').openModal();
        $('#first-name').focus();
    }
});