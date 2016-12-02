import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Listings } from '../api/listings.js';

import './my-listings.html';

Template.myListings.onCreate(function () {
    Meteor.subscribe('myListings');
});