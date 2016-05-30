/*****************Import Region************************/
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import {Upload} from './upload.js'
/*****************Todo Methods Region************************/

export const deleteFile = new ValidatedMethod({
  name: 'deleteFile',
  validate: new SimpleSchema({
    _id: { type: String },

  }).validator(),
  run({ _id}) {

    var upload = Uploads.findOne(_id);
    if (upload == null) {
      throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
    }

    UploadServer.delete(upload.path);
    Uploads.remove(_id);

  }
});