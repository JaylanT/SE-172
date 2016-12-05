import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Promise } from 'meteor/promise';
import { $ } from 'meteor/jquery';
import { Materialize } from 'meteor/materialize:materialize'

import { Pictures } from '../api/pictures.js';

import './states.js';
import './categories.js';
import './sell.html';
import './picture-frame.html';

Template.sell.onCreated(function() {
    this.ready = new ReactiveVar(true);

    // client-side collection
    this.TempPhotos = new Mongo.Collection(null);
});

Template.sell.onRendered(function () {
    this.find('.picture-preview-row')._uihooks = {
        insertElement: (node, next) => $(node).hide().insertBefore(next).fadeIn(),
        removeElement: (node) => $(node).fadeOut(() => $(this).remove())
    };
});

Template.sell.helpers({
    ready() {
        return Template.instance().ready.get();
    },
    pictures() {
        return Template.instance().TempPhotos.find();
    },
    picLimitLabel() {
        if (!Template.instance().TempPhotos.findOne()) return 'Add up to 4 photos';

        return 'Add up to ' + (4 - Template.instance().TempPhotos.find().count()) + ' more';
    },
    picLimitReached() {
        return Template.instance().TempPhotos.find().count() === 4;
    },
});

Template.sell.events({
    'change #post-pictures'(event, template) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 2097152) {
                Materialize.toast('File size cannot exceed 2MB.', 4000, 'toast-error');
                return;
            }
        }
        if (files.length + template.TempPhotos.find().count() > 4) {
            Materialize.toast('Picture limit exceeded.', 4000, 'toast-error');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.onload = ev => {
                template.TempPhotos.insert({
                    picture: ev.target.result,
                    name: files[i].name
                });
            };
            reader.readAsDataURL(files[i]);
        }

        // clear file input
        let picInput = $('#post-pictures');
        picInput.replaceWith(picInput = picInput.clone(true));
    },
    'click .remove-picture'(_, template) {
        template.TempPhotos.remove(this);
    },
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

        template.ready.set(false);

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

        const photos = template.TempPhotos.find().fetch();
        if (photos.length === 0) {
            listing.photoIds = [];
            insertListing(listing);
        } else {
            const promises = [];
            photos.forEach(blob => {
                promises.push(insertPhoto(blob));
            });

            Promise.all(promises)
                .then(photoIds => {
                    listing.photoIds = photoIds;
                    insertListing(listing);
                })
                .catch(err => {
                    template.ready.set(false);
                    Materialize.toast('Error during upload: ' + err, 4000, 'toast-error');
                });
        }
    }
});

function insertPhoto(blob) {
    return new Promise((resolve, reject) => {
        Pictures.insert({
            file: blob.picture,
            isBase64: true,
            fileName: blob.name
        })
            .on('error', (err, fileObj) => {
                reject(err, fileObj);
            })
            .on('end', (err, fileObj) => {
                if (err) {
                    reject(err, fileObj);
                } else {
                    resolve(fileObj._id);
                }
            });
    })
}

function insertListing(listing) {
    Meteor.call('listings.insert', listing, (err, id) => {
        if (err) {
            console.log(err);
            Materialize.toast('An error has occurred.', 4000, 'toast-error');
        } else {
            FlowRouter.go('/listing/' + id);
        }
    });
}