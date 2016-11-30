import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Listings = new Mongo.Collection('listings');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('listings', function tasksPublication() {
        return Listings.find();
    });
}

Meteor.methods({
    'listings.insert'(listing) {
        Listings.insert(listing);
    }
});