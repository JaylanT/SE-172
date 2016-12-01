import { Template } from 'meteor/templating';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './browse.html';

Template.listings.onCreated(function () {
    Meteor.subscribe('listings');
});

Template.listings.helpers({
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 } });
    },
});

Template.listingCard.onCreated(function () {
    Meteor.subscribe('files.pictures.all');
});

Template.listingCard.helpers({
    picture() {
        return Pictures.findOne(this.pictureIds[0]);
    }
});