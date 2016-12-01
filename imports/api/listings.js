import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Listings = new Mongo.Collection('listings');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('listings', () => {
        return Listings.find();
    });
    Meteor.publish('singleListing', id => {
        return Listings.find(id);
    });
}

Meteor.methods({
    'listings.insert'(listing) {
        check(listing, {
           title: String,
            price: Number,
            description: String,
            city: String,
            state: String,
            pictureIds: Match.Where(ids => {
                check(ids, [String]);
                return ids.length >= 0 && ids.length < 5;
            })
        });

        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        listing.createdAt = new Date();

        Listings.insert(listing);
    }
});