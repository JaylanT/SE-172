import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './my-listings.html';
import './remove-listing-modal.html';

Template.myListings.onCreated(function () {
    this.subscribe('myListings');
    this.subscribe('files.pictures.all');
});

Template.myListings.helpers({
    hasListings() {
        return Listings.findOne();
    },
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 } });
    },
    picture() {
        if (this.pictureIds[0]) {
            return Pictures.findOne(this.pictureIds[0]).link();
        } else {
            return '/photo.png';
        }
    },
    date() {
        const date = new Date(this.createdAt),
            options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
    }
});

let listingToRemove;

Template.myListings.events({
    'click .remove-listing'() {
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