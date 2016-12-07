import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Materialize } from 'meteor/materialize:materialize';

import './edit-listing.html';

Template.editListing.onRendered(function () {
    const data = this.data;

    if (data) {
        const category = data.category,
            state = data.state;

        $('select[id$="post-category"] option[value="' + category + '"]').attr('selected', true);
        $('select[id$="post-state"] option[value="' + state + '"]').attr('selected', true);
    }

    $('#post-description-textarea').trigger('autoresize');
    $('select').material_select();
});

Template.editListing.events({
    'submit form'(event, template) {
        event.preventDefault();

        const target = event.target;

        const title = target.title.value,
            category = target.category.value,
            price = Number(target.price.value),
            description = target.description.value,
            city = target.city.value,
            state = target.state.value,
            phone = target.phone.value,
            email = target.email.value;

        if (category === '') {
            Materialize.toast('Please select a category', 4000, 'toast-error');
            return;
        }

        if (state === '') {
            Materialize.toast('Please select a state', 4000, 'toast-error');
            return;
        }

        const listing = {
            title: title,
            category: category,
            price: price,
            description: description,
            city: city,
            state: state,
            phone: phone,
            email: email
        };

        Meteor.call('listings.update', template.data._id, listing, err => {
            $('#edit-listing-modal').closeModal();
        });
    }
});