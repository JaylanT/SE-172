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

    Meteor.publish('search', (query, city, state, category, minPrice, maxPrice) => {
        check(query, String);
        check(city, Match.Maybe(String));
        check(state, Match.Maybe(String));
        check(category, Match.Maybe(String));
        check(minPrice, Match.Maybe(Number));
        check(maxPrice, Match.Maybe(Number));

        const options = {
            $text: { $search: query }
        };

        if (city)
            options.city_lower = city;

        if (state)
            options.state = state;

        if (category)
            options.category = category;

        if (minPrice && maxPrice) {
            options.$and = [{ price: {$gte: minPrice} }, { price: {$lte: maxPrice} }];
        } else if (minPrice) {
            options.price = { $gte: minPrice };
        } else if (maxPrice) {
            options.price = { $lte: maxPrice };
        }

        return [
            Listings.find(options),
            Pictures.find().cursor
        ]
    });

    Listings._ensureIndex({
        'title': 'text',
        'description': 'text',
        'category': 1,
        'city_lower': 1,
        'state': 1,
        'price': 1,
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
        listing.city_lower = listing.city.toLowerCase();

        return Listings.insert(listing);
    },
    'listings.remove'(listingId) {
        check(listingId, String);

        const listing = Listings.findOne(listingId);
        if (listing.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Listings.remove(listingId);
    },
    'listings.update'(listingId, listingData) {
        check(listingId, String);
        check(listingData, {
            title: String,
            category: String,
            price: Number,
            description: String,
            city: String,
            state: String,
            phone: Match.Optional(String),
            email: String
        });

        listingData.city_lower = listingData.city.toLowerCase();

        return Listings.update(listingId, { $set: listingData });
    }
});