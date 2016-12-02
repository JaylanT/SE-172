import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './listing.html';

Template.listing.onCreated(function () {
    const listingId = FlowRouter.getParam('id');

    Meteor.subscribe('singleListing', listingId);
    Meteor.subscribe('files.pictures.all');
});

Template.listing.onRendered(function () {
    $('.carousel').carousel();
});

Template.listing.helpers({
    listing() {
        const listingId = FlowRouter.getParam('id');
        return Listings.findOne(listingId);
    },
    picture(id) {
        const picture = Pictures.findOne(id);

        if (picture)
            return picture.link();
    },
    isOwner(ownerId) {
        return Meteor.userId() === ownerId;
    }
});

Template.listing.events({
    'click #remove-listing'() {
        Meteor.call('listings.remove', this._id, (err, result) => {
            if (!err) {
                FlowRouter.go('/');
            }
        });
    }
});