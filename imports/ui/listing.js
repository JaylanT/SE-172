import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './listing.html';
import './remove-listing-modal.html';

Template.listing.onCreated(function () {
    const listingId = FlowRouter.getParam('id');
    this.subscribe('singleListing', listingId);
});

Template.photoCarousel.onRendered(function () {
    $('#photo-carousel').owlCarousel({
        navigation: true, // Show next and prev buttons
        slideSpeed: 300,
        rewindSpeed: 300,
        paginationSpeed: 400,
        singleItem: true,
        navigationText: [
            '<i class="material-icons">chevron_left</i>',
            '<i class="material-icons">chevron_right</i>'
        ]
    });
});

Template.photoCarousel.helpers({
    picture(id) {
        const picture = Pictures.findOne(id);

        if (picture)
            return picture.link();
    },
});

Template.listing.helpers({
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