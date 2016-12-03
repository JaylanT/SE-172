import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Listings } from '../api/listings.js';
import { Pictures } from '../api/pictures.js';

import './browse.html';

Template.listings.onCreated(function () {
    this.ready = new ReactiveVar();

    this.autorun(() => {
        const handle = this.subscribe('listings');
        this.ready.set(handle.ready());
    });
});

Template.listings.helpers({
    ready() {
        return Template.instance().ready.get();
    },
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 }, limit: 20 });
    },
});

Template.listingCard.onCreated(function () {
    this.subscribe('files.pictures.all');
});

Template.listingCard.helpers({
    picture() {
        return Pictures.findOne(this.pictureIds[0]);
    }
});