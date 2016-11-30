import { Template } from 'meteor/templating';

import './categories.html';

Template.categories.onRendered(() => {
    $('select').material_select();
});