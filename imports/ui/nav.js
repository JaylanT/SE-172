import { Template } from 'meteor/templating';

import './nav.html';

Template.nav.onRendered(() => {
    $(".dropdown-button").dropdown();
});
