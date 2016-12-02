import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './listing.html';
import './remove-listing-modal.html';

Template.listing.onCreated(function () {
    const listingId = FlowRouter.getParam('id');

    this.subscribe('singleListing', listingId);
    this.subscribe('files.pictures.all');
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

let listingToRemove;

Template.listing.events({
    'click #remove-listing'() {
        listingToRemove = this._id;
        $('#confirm-remove-listing-modal').openModal();
    },
    'click #remove-listing-confirm'() {
        Meteor.call('listings.remove', listingToRemove);
        listingToRemove = "";
    }
});