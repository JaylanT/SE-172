import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Pictures } from '../api/pictures.js';

import './categories.js';
import './sell.html';
import './picture-frame.html';

Template.sell.onCreated(function() {
    this.address = new ReactiveVar();

    navigator.geolocation.getCurrentPosition(position => {
        const coords = position.coords;
        HTTP.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {latlng: coords.latitude + ',' + coords.longitude}},
            (err, res) => {
                if (!err) {
                    const results = res.data.results;
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].types.indexOf('locality') > -1) {
                            this.address.set(results[i].address_components);
                            break;
                        }
                    }
                }
            });
    });

    TempPhotos = new Mongo.Collection(null);
});

Template.sell.onRendered(function () {
    this.find('.picture-preview-row')._uihooks = {
        insertElement: (node, next) => $(node).hide().insertBefore(next).fadeIn(),
        removeElement: (node) => $(node).fadeOut(() => $(this).remove())
    };
});

Template.sell.helpers({
    city() {
        if (Template.instance().address.get()) {
            return Template.instance().address.get()[0].long_name;
        }
    },
    state() {
        if (Template.instance().address.get()) {
            return Template.instance().address.get()[2].long_name;
        }
    },
    pictures() {
        return TempPhotos.find();
    },
    picLimitLabel() {
        if (!TempPhotos.findOne()) return 'Add up to 4 photos';

        return 'Add up to ' + (4 - TempPhotos.find().count()) + ' more';
    },
    picLimitReached() {
        return TempPhotos.find().count() === 4;
    },
});

Template.sell.events({
    'change #post-pictures'(e) {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 2097152) {
                Materialize.toast('File size cannot exceed 2MB.', 4000, 'toast-error');
                return;
            }
        }
        if (files.length + TempPhotos.find().count() > 4) {
            Materialize.toast('Picture limit exceeded.', 4000, 'toast-error');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.onload = ev => {
                TempPhotos.insert({
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
    'click .remove-picture'() {
        TempPhotos.remove(this);
    },
    'submit form'(event) {
        event.preventDefault();

        const target = event.target;
        const title = target.title.value,
            category = target.category.value,
            price = Number(target.price.value),
            description = target.description.value,
            city = target.city.value,
            state = target.state.value,
            phone = target.phone.value;

        if (category === '') {
            Materialize.toast('Please select a category', 4000, 'toast-error');
            return;
        }

        const pictureIds = [],
            pictures = TempPhotos.find().fetch();

        const listing = {
            title: title,
            category: category,
            price: price,
            description: description,
            city: city,
            state: state,
            phone: phone,
            pictureIds: pictureIds
        };

        if (pictures.length === 0) {
            insertListing(listing);
        } else {
            pictures.forEach(blob => {
                const upload = Pictures.insert({
                    file: blob.picture,
                    isBase64: true,
                    fileName: blob.name
                });

                upload.on('end', (error, fileObj) => {
                    if (error) {
                        Materialize.toast('Error during upload: ' + error, 4000, 'toast-error');
                    } else {
                        pictureIds.push(fileObj._id);

                        if (pictureIds.length === pictures.length) {
                            insertListing(listing);
                        }
                    }
                });
            });
        }
    }
});

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