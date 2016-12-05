import { Template } from 'meteor/templating';

import { Listings } from '../api/listings.js';


import './home.html';
import './listing-card.js';

Template.listings.onCreated(function () {
    this.subscribe('listings');
    this.subscribe('files.pictures.all');
});

Template.listings.helpers({
    hasListings() {
        return Listings.findOne();
    },
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 }, limit: 20 });
    },
});