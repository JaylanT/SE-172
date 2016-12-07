import { Template } from 'meteor/templating';

import { Pictures } from '../../api/pictures.js';

import './listing-card.html';

Template.listingCard.helpers({
    picture() {
        return Pictures.findOne(this.photoIds[0]);
    },
    date() {
        const date = new Date(this.createdAt),
            options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
    }
});