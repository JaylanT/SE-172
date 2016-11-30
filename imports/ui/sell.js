import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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

    TempPictures = new Mongo.Collection(null);

    Meteor.subscribe('files.pictures.all');
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
        return TempPictures.find();
    },
    picLimitLabel() {
        if (!TempPictures.findOne()) return 'Add up to 4 pictures';

        return 'Add up to ' + (4 - TempPictures.find().count()) + ' more';
    },
    picLimitReached() {
        return false;
    },
});

Template.sell.events({
    'change #post-pictures'(e) {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 1048576) {
                Materialize.toast('File size cannot exceed 1MB.', 4000, 'toast-error');
                return;
            }
        }
        if (files.length + TempPictures.find().count() > 4) {
            Materialize.toast('Picture limit exceeded.', 4000, 'toast-error');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.onload = ev => TempPictures.insert({picture: ev.target.result});
            reader.readAsDataURL(files[i]);
        }

        // clear file input
        let picInput = $('#post-pictures');
        picInput.replaceWith(picInput = picInput.clone(true));
    },
    'click .remove-picture'() {
        TempPictures.remove(this);
    },
    'submit form'(event) {
        event.preventDefault();

        const target = event.target;
        const title = target.title.value,
            price = target.price.value,
            description = target.description.value,
            city = target.city.value,
            state = target.state.value;

        const pictureIds = [],
            pictures = TempPictures.find().fetch();

        const listing = {
            title: title,
            price: price,
            description: description,
            city: city,
            state: state,
            pictureIds: pictureIds
        };

        if (pictures.length === 0) {
            Meteor.call('listings.insert', listing);
        } else {
            pictures.forEach(blob => {
                const upload = Pictures.insert({
                    file: blob.picture,
                    isBase64: true,
                    fileName: 'test.png'
                });

                upload.on('end', (error, fileObj) => {
                    if (error) {
                        alert('Error during upload: ' + error);
                    } else {
                        pictureIds.push(fileObj._id);

                        if (pictureIds.length === pictures.length) {
                            Meteor.call('listings.insert', listing);
                        }
                    }
                });
            });
        }
    }
});