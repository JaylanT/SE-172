import { Template } from 'meteor/templating';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './home.html';

Template.listings.onCreated(function () {
    this.subscribe('listings');
});

Template.listings.helpers({
    hasListings() {
        return Listings.findOne();
    },
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 }, limit: 20 });
    },
});

Template.listingCard.onCreated(function () {
    this.subscribe('files.pictures.all');
});

Template.listingCard.helpers({
    picture() {
        return Pictures.findOne(this.photoIds[0]);
    }
});