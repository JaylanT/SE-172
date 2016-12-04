import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import './categories.html';

Template.categories.onRendered(() => {
    $('select').material_select();
});