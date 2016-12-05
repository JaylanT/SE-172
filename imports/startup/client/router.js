import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/spinner.js';
import '../../ui/main-layout.js';
import '../../ui/nav.js';
import '../../ui/sell.js';
import '../../ui/home.js';
import '../../ui/listing.js';
import '../../ui/signup.js';
import '../../ui/login.js';
import '../../ui/my-listings.js';
import '../../ui/favorite.js';

const loggedIn = FlowRouter.group({
    // Redirects to login if not logged in
    triggersEnter: [function () {
        if (!(Meteor.loggingIn() || Meteor.userId())) {
            // const route = FlowRouter.current();
            // if (route.route.name !== 'login') {
            //     Session.set('redirectAfterLogin', route.path);
            // }
            FlowRouter.go('/login');
        }
    }]
});

FlowRouter.route('/', {
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'listings' });
    }
});

FlowRouter.route('/login', {
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'login' });
    }
});

loggedIn.route('/sell', {
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'sell' });
    }
});

FlowRouter.route('/listing/:id', {
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'listing' });
    }
});

loggedIn.route('/logout', {
    action(params, queryParams) {
        Meteor.logout(err => {
            FlowRouter.go('/');
        });
    }
});

loggedIn.route('/mylistings', {
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'myListings' });
    }
});

loggedIn.route('/favorites', {
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'favorites' });
    }
});