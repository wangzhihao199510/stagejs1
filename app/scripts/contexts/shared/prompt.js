/**
 * This is the Shared.Prompt module that renders a dialog(modal or window div) on screen upon app:prompt event.
 * Pre-defined dialogs are:
 * 1. confirm - with a text/html/view as question and Yes/No buttons; - customized or jquery ui dialog, can NOT move, optionally attached to a target using flyTo
 * 2. alert - with a text/html/view as content and Ok button; - jquery ui dialog, can NOT move, modal
 * 3. window - with html/view as content; - jquery ui dialog can move around
 *
 * @author Tim.Liu
 * @create 2013.12.25
 */

;(function(app){

	var context = app.Context.Shared;
	var module = context.module('Prompt');

	_.extend(module, {

		View: {

		}

	});

})(Application);

Template.extend(
	'custom-module-shared-notify-prompt-confirm-tpl',
	[
		' '
	]
);

Template.extend(
	'custom-module-shared-notify-prompt-dialog-tpl',
	[
		' '
	]
);