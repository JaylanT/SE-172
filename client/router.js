import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../imports/ui/todos.js';
import '../imports/ui/sell.js';
import '../imports/ui/browse.js';
import '../imports/ui/listing.js';

const loggedIn = FlowRouter.group({
    // Redirects to login if not logged in
    triggersEnter: [function () {
        if (!(Meteor.loggingIn() || Meteor.userId())) {
            const route = FlowRouter.current();
            // if (route.route.name !== 'login') {
            //     Session.set('redirectAfterLogin', route.path);
            // }
            FlowRouter.go('/');
        }
    }]
});

FlowRouter.route('/', {
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'listings' });
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