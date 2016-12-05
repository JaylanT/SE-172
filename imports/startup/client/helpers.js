import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze'

Template.registerHelper('breaklines', function(text) {
    text = Blaze._escape(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Spacebars.SafeString(text);
});