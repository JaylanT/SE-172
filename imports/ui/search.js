import { Template } from 'meteor/templating';

import { Listings } from '../api/listings.js';

import './search.html';

Template.search.onCreated(function () {
    this.autorun(() => {
        const query = FlowRouter.getQueryParam('q');

        if (query) {
            this.subscribe('search', query);
        }
    });
});

Template.search.helpers({
    foundListings() {
        return Listings.findOne();
    },
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 } });
    },
});