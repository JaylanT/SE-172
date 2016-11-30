import { Meteor } from 'meteor/meteor';

export const Pictures = new FilesCollection({
    collectionName: 'Pictures',
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload: function (file) {
        // Allow upload files under 2MB, and only in png/jpg/jpeg formats
        if (file.size <= 2097152 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 2MB';
        }
    }
});

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('files.pictures.all', function () {
        return Pictures.find().cursor;
    });
}
