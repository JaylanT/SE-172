import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import { Listings } from '../../api/listings.js';
import { Pictures } from '../../api/pictures.js';
import { Favorites } from '../../api/favorites.js';

import './listing.html';
import '../components/remove-listing-modal.html';
import './edit-listing.js';

Template.listing.onCreated(function () {
    const listingId = FlowRouter.getParam('id');
    this.subscribe('singleListing', listingId);
    this.subscribe('favorites');
});

Template.listing.helpers({
    listing() {
        const listingId = FlowRouter.getParam('id');
        return Listings.findOne(listingId);
    },
    isOwner(ownerId) {
        return Meteor.userId() === ownerId;
    },
    date() {
        const date = new Date(this.createdAt),
            options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
    },
    favorited() {
        const listingId = FlowRouter.getParam('id');
        return Favorites.findOne({ listings: listingId });
    }
});

Template.listing.events({
    'click #remove-listing'() {
        $('#confirm-remove-listing-modal').openModal();
    },
    'click #remove-listing-confirm'() {
        const listingId = FlowRouter.getParam('id');
        Meteor.call('listings.remove', listingId, err => {
            FlowRouter.go('/mylistings');
        });
    },
    'click #edit-listing'() {
        $('#edit-listing-modal').openModal();
    },
    'click #favorite-listing'() {
        const listingId = FlowRouter.getParam('id');
        Meteor.call('favorites.setFavorited', listingId);
    }
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

Template.listingOptions.onRendered(function () {
    $('.dropdown-button').dropdown({
            alignment: 'right'
        }
    );
});
