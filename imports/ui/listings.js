import { Template } from 'meteor/templating';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './listings.html';

Template.listings.onCreated(function bodyOnCreated() {
    Meteor.subscribe('listings');
});

Template.listings.helpers({
    listings() {
        return Listings.find();
    },
});

Template.listing.onCreated(function bodyOnCreated() {
    Meteor.subscribe('files.pictures.all');
});

Template.listing.helpers({
    picture() {
        console.log(Pictures.findOne());
        return Pictures.findOne();
    }
});