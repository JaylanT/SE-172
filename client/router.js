import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../imports/ui/todos.js'

FlowRouter.route('/', {
    action: (params, queryParams) => {
        BlazeLayout.render('mainLayout', { top: 'nav', content: 'todos' });
    }
});