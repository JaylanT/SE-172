import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/nav.js';
import '/imports/ui/sell.js';
import '/imports/ui/browse.js';
import '/imports/ui/listing.js';
import '/imports/ui/signup.js';
import '/imports/ui/login.js';
import '/imports/ui/my-listings.js';

const loggedIn = FlowRouter.group({
    // Redirects to login if not logged in
    triggersEnter: [function () {
        if (!(Meteor.loggingIn() || Meteor.userId())) {
            const route = FlowRouter.current();
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