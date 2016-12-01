import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Listings } from '../api/listings.js';

import './listing.html';

Template.listing.onCreated(function () {
    const listingId = FlowRouter.getParam('id');

    Meteor.subscribe('singleListing', listingId);
});

Template.listing.helpers({
    listing() {
        const listingId = FlowRouter.getParam('id');
        return Listings.findOne(listingId);
    }
});