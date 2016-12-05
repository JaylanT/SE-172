import { Template } from 'meteor/templating';

import './listing-card.html';

Template.listingCard.helpers({
    date() {
        const date = new Date(this.createdAt),
            options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
    }
});