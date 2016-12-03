import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './listing.html';
import './remove-listing-modal.html';

Template.listing.onCreated(function () {
    const listingId = FlowRouter.getParam('id');

    this.ready = new ReactiveVar();

    this.autorun(() => {
        const handle = this.subscribe('singleListing', listingId);
        this.ready.set(handle.ready());
    });
});

Template.photoCarousel.onRendered(function () {
    $('.carousel').carousel();
});

Template.photoCarousel.helpers({
    picture(id) {
        const picture = Pictures.findOne(id);

        if (picture)
            return picture.link();
    },
});

Template.listing.helpers({
    ready() {
        return Template.instance().ready.get();
    },
    listing() {
        const listingId = FlowRouter.getParam('id');
        return Listings.findOne(listingId);
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
        Meteor.call('listings.remove', listingToRemove, err => {
            listingToRemove = "";
            FlowRouter.go('/mylistings');
        });
    }
});