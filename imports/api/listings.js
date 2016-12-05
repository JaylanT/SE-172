import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

import { Pictures } from './pictures.js';

export const Listings = new Mongo.Collection('listings');

if (Meteor.isServer) {
    Meteor.publish('listings', () => {
        return Listings.find();
    });

    Meteor.publish('singleListing', id => {
        check(id, String);

        const listing = Listings.findOne(id),
            photoIds = listing.photoIds;

        if (photoIds.length > 0) {
            return [
                Listings.find(id),
                Pictures.find({ _id: { $in: photoIds } }).cursor
            ];
        }

        return Listings.find(id);
    });

    Meteor.publish('myListings', function () {
        return [
            Listings.find({ owner: this.userId }),
            Pictures.find().cursor
        ]
    });

    Meteor.publish('search', query => {
        return [
            Listings.find({
                $text: { $search: query }
            }),
            Pictures.find().cursor
        ]
    });

    Listings._ensureIndex({
        'title': 'text',
        'category': 'text',
        'description': 'text',
        'city': 'text',
        'state': 'text',
        'owner': 1
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
            email: String,
            photoIds: Match.Where(ids => {
                check(ids, [String]);
                return ids.length < 5;
            })
        });

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        listing.createdAt = new Date();
        listing.owner = this.userId;

        return Listings.insert(listing);
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