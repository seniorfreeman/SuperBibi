import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { listRenderHold } from '../launch-screen.js';

import './home-page.jade';

import './app-not-found.js';
import './content/content-page.js';
import './profile/profile-page.js';
import './volume/volume-page.js';
import './amis/amis-page.js';
import './dossier/dossier-page.js';
import './invitation/invitation-page.js';
import '../components/soft/soft.js';
import '../components/nav/nav.js';
import '../components/aside/aside.js';
import '../lib/modals/modals.js';
import '../lib/modals/modalOverrides.js';
import '../components/modals/invit-co-mover-modal.js';
import '../components/modals/invit-message-modal.js';

Template.home_page.onCreated(function themesShowPageOnCreated() {});

Template.home_page.onRendered(function listsShowPageOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      listRenderHold.release();
    }
  });
});
