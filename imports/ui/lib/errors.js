import { TAPi18n } from 'meteor/tap:i18n';

export const displayError = (error) => {
  if (error) {
    // It would be better to not alert the error here but inform the user in some
    // more subtle way
    //alert(TAPi18n.__(error.error)); // eslint-disable-line no-alert
    toastr.options.positionClass= "toast-top-center";
    toastr.error(TAPi18n.__(error.error), TAPi18n.__("error"));
  }
};

export const validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
