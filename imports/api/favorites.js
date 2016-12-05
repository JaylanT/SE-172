import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Listings } from './listings.js';
import { Pictures } from './pictures.js';

export const Favorites = new Mongo.Collection('favorites');

if (Meteor.isServer) {
    Meteor.publish('favorites', function () {
        return Favorites.find({ owner: this.userId });
    });
    Meteor.publish('favoriteListings', function () {
        const favorites = Favorites.findOne({ owner: this.userId });

        if (favorites && favorites.listings && favorites.listings.length > 0) {
            return [
                Favorites.find({ owner: this.userId }),
                Listings.find({ _id: { $in: favorites.listings }}),
                Pictures.find().cursor
            ]
        } else {
            return [];
        }
    })
}

Meteor.methods({
    'favorites.setFavorited'(listingId) {
        check(listingId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        const userFavorites = Favorites.findOne({ owner: this.userId });

        if (userFavorites && userFavorites.listings && userFavorites.listings.indexOf(listingId) > -1) {
            Favorites.update({
                owner: this.userId
            }, {
                $pull: { listings: listingId }
            });
        } else {
            Favorites.upsert({
                owner: this.userId
            }, {
                $addToSet: { listings: listingId }
            });
        }
    }
});