import { Meteor } from 'meteor/meteor';
import Request from 'request';
import { Random } from 'meteor/random'
import knox from 'knox';

let bound, client, cfDomain = {};

if (Meteor.isServer) {
    // Fix CloudFront certificate issue
    // Read: https://github.com/chilts/awssum/issues/164
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    bound = Meteor.bindEnvironment(function(callback) {
        return callback();
    });
    cfDomain = 'https://d21gjh04jls4zc.cloudfront.net'; // <-- Change to your Cloud Front Domain
    client = knox.createClient({
        key: 'AKIAIKPQQWNV2U7NQLXQ',
        secret: 'n4LJ/Vr8IKfBOgAQcRQe1NO9MJ8TA0ea5PDrom5j',
        bucket: 'markt172',
        region: 'us-west-1'
    });
}

export const Pictures = new FilesCollection({
    collectionName: 'pictures',
    throttle: false,
    storagePath: 'assets/app/uploads/uploadedFiles',
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload: function (file) {
        // Allow upload files under 2MB, and only in png/jpg/jpeg formats
        if (file.size <= 2097152 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 2MB';
        }
    },
    onAfterUpload: function (fileRef) {
        const self = this;
        _.each(fileRef.versions, function(vRef, version) {
            // We use Random.id() instead of real file's _id
            // to secure files from reverse engineering
            // As after viewing this code it will be easy
            // to get access to unlisted and protected files
            const filePath = "files/" + (Random.id()) + "-" + version + "." + fileRef.extension;
            client.putFile(vRef.path, filePath, function(error, res) {
                bound(function() {
                    let upd;
                    if (error) {
                        console.error(error);
                    } else {
                        upd = {
                            $set: {}
                        };
                        upd['$set']["versions." + version + ".meta.pipeFrom"] = cfDomain + '/' + filePath;
                        upd['$set']["versions." + version + ".meta.pipePath"] = filePath;
                        self.collection.update({
                            _id: fileRef._id
                        }, upd, function(error) {
                            if (error) {
                                console.error(error);
                            } else {
                                // Unlink original files from FS
                                // after successful upload to AWS:S3
                                self.unlink(self.collection.findOne(fileRef._id), version);
                            }
                        });
                    }
                });
            });
        });
    },
    interceptDownload: function(http, fileRef, version) {
        let path, ref, ref1, ref2;
        path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
        if (path) {
            // If file is moved to S3
            // We will pipe request to S3
            // So, original link will stay always secure
            Request({
                url: path,
                headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
            }).pipe(http.response);
            return true;
        } else {
            // While file is not yet uploaded to S3
            // We will serve file from FS
            return false;
        }
    }
});

if (Meteor.isServer) {
    // Intercept File's collection remove method
    // to remove file from S3
    const _origRemove = Pictures.remove;

    Pictures.remove = function(search) {
        const cursor = this.collection.find(search);
        cursor.forEach(function(fileRef) {
            _.each(fileRef.versions, function(vRef) {
                let ref;
                if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
                    client.deleteFile(vRef.meta.pipePath, function(error) {
                        bound(function() {
                            if (error) {
                                console.error(error);
                            }
                        });
                    });
                }
            });
        });
        // Call original method
        _origRemove.call(this, search);
    };
}

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('files.pictures.all', function () {
        return Pictures.find().cursor;
    });
}
