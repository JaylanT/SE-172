import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';
import { Favorites } from '../api/favorites.js';

import './favorite.html';

Template.favorites.onCreated(function () {
    this.subscribe('favoriteListings');
});

Template.favorites.helpers({
    hasFavorites() {
        const favorites = Favorites.findOne();
        return favorites && favorites.listings && favorites.listings.length > 0;
    },
    listings() {
        const favorites = Favorites.findOne();
        if (favorites && favorites.listings) {
            return Listings.find({ _id: { $in: favorites.listings }}, { sort: { createdAt: -1 } });
        }
    }
});

Template.favoriteItem.helpers({
    picture() {
        if (this.photoIds[0]) {
            return Pictures.findOne(this.photoIds[0]).link();
        } else {
            return '/photo.png';
        }
    },
    date() {
        const date = new Date(this.createdAt),
            options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
    }
});

Template.favoriteItem.events({
    'click .remove-favorite'() {
        Meteor.call('favorites.setFavorited', this._id);
    }
});