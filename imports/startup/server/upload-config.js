import { Uploads } from '../../api/collections/collections.js';

Meteor.startup( function() {

  UploadServer.init({
    tmpDir: '/images/Uploads/tmp',
    uploadDir:'/mages/Uploads/',
    checkCreateDirectories: true,
    finished: function (fileInfo, formFields) {
      console.log("upload finished, fileInfo ", fileInfo);
      console.log("upload finished, formFields: ", formFields);
      Uploads.insert(fileInfo);
    },
    cacheTime: 100,
    mimeTypes: {
      "xml": "application/xml",
      "vcf": "text/x-vcard"
    },
    validateRequest: function (req, res) {}
  })
  
  Avatar.setOptions({
    defaultImageUrl: "/images/avatar.png",
    customImageProperty: function() {
      var user = this;
      // calculate the image URL here
      return user.profile.picture;
    }
  });

});