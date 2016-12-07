import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';

import { Listings } from '../../api/listings.js';

import '../select_options/categories.js';
import '../select_options/states.js';
import './search.html';

Template.search.onCreated(function () {
    this.autorun(() => {
        const query = FlowRouter.getQueryParam('q'),
            city = FlowRouter.getQueryParam('city'),
            state = FlowRouter.getQueryParam('state'),
            category = FlowRouter.getQueryParam('category'),
            minPrice = Number(FlowRouter.getQueryParam('minPrice')),
            maxPrice = Number(FlowRouter.getQueryParam('maxPrice'));

        this.subscribe('search', query, city, state, category, minPrice, maxPrice);
    });
});

Template.search.onRendered(function () {
    const category = FlowRouter.getQueryParam('category'),
        state = FlowRouter.getQueryParam('state');

    $('select[id$="search-category"] option[value="' + category + '"]').attr('selected', true);
    $('select[id$="search-state"] option[value="' + state + '"]').attr('selected', true);
    $('select').material_select();
});

Template.search.helpers({
    listings() {
        return Listings.find({}, { sort: { createdAt: -1 } });
    },
    query() {
        return FlowRouter.getQueryParam('q');
    },
    city() {
        return FlowRouter.getQueryParam('city');
    },
    minPrice() {
        return FlowRouter.getQueryParam('minPrice');
    },
    maxPrice() {
        return FlowRouter.getQueryParam('maxPrice');
    },
    resultsCount() {
        const count = Listings.find().count();

        if (count === 1) {
            return '1 result';
        }
        return count + ' results';
    }
});

Template.search.events({
    'keyup #search-input':
        _.debounce(event => {
            const target = event.target;

            const query = target.value.trim();

            FlowRouter.setQueryParams({q: query});
        }, 450),
    'change #search-category'(event) {
        const target = event.target;

        const category = target.value;

        FlowRouter.setQueryParams({category: category});
    },
    'keyup #search-city':
        _.debounce(event => {
            const target = event.target;

            const city = target.value.trim().toLowerCase();

            FlowRouter.setQueryParams({city: city});
        }, 450),
    'change #search-state'(event) {
        const target = event.target;

        const state = target.value;

        FlowRouter.setQueryParams({state: state});
    },
    'keyup #search-min-price, change #search-min-price':
        _.debounce(event => {
            const target = event.target;

            const minPrice = target.value.trim();

            FlowRouter.setQueryParams({minPrice: minPrice});
        }, 450),
    'keyup #search-max-price, change #search-max-price':
        _.debounce(event => {
            const target = event.target;

            const maxPrice = target.value.trim();

            FlowRouter.setQueryParams({maxPrice: maxPrice});
        }, 450),
    'click #show-filter'() {
        $('#filter-options').slideToggle(300);
    },
    'click #hide-filter'() {
        $('#filter-options').slideUp(300);
    }
});
