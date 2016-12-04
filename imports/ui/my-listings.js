import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { Materialize } from 'meteor/materialize:materialize'

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './my-listings.html';
import './remove-listing-modal.html';

Template.myListings.onCreated(function () {
    this.subscribe('myListings');

});

Template.myListings.helpers({
    hasListings() {
        return Listings.findOne();
    },
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 } });
    },
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
        });
    }
});

Template.listingItem.helpers({
    picture() {
        if (this.photoIds[0]) {
            return Pictures.findOne(this.photoIds[0]).link();
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