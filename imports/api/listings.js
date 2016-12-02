import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Listings = new Mongo.Collection('listings');

if (Meteor.isServer) {
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
            category: String,
            price: Number,
            description: String,
            city: String,
            state: String,
            phone: Match.Optional(String),
            pictureIds: Match.Where(ids => {
                check(ids, [String]);
                return ids.length < 5;
            })
        });

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        listing.createdAt = new Date();
        listing.owner = this.userId;

        Listings.insert(listing);
    },
    'listings.remove'(listingId) {
        check(listingId, String);

        const listing = Listings.findOne(listingId);
        if (listing.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Listings.remove(listingId);
    }
});