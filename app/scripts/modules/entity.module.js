/**
 * Generated through `models/entity.json` for Backbone module **Entity**
 *
 * 
 * Mother of All Models
 *
 *
 * **General Note**
 * A module has a Model a Collection (with pagination support) and a few View objects to render itself
 * on different occations. The most common ones are View.Form and View.DataGrid:
 *
 * View.Form - Used to render a form to create a new model object from user inputs. The fieldset tpl are
 * 			   there to help to override the default 'append' operation when adding field editors. tpl 
 * 			   names are the 'id' of <script type="text/tpl">...</script> tags. tpl should use 
 * 			   <tag target="fieldname">...</tag> to identify the placeholder for certain field editor.
 *
 * View.DataGrid - Used to render a grid widget for displaying records of this module. It will call 
 * 				   collection.fetch() to populate the grid data upon rendering.
 * 
 * 
 * @module Entity
 * @author Tim.Liu (zhiyuanliu@fortinet.com)
 * @updated 
 * 
 * @generated on Tue Mar 12 2013 22:37:14 GMT+0800 (CST) 
 * Contact Tim.Liu for generator related issue (zhiyuanliu@fortinet.com)
 * 
 */

(function(app) {

    var module = app.module("Entity");

    /**
     *
     * **Model**
     * 
     * We use Backbone.RelationalModel instead of the original Backbone.Model
     * for better has-many relation management.
     * 
     * @class Application.Entity.Model
     */
    module.Model = Backbone.RelationalModel.extend({

        //the id attribute to use
        idAttribute: '_id',

        //relations:
        relations: [{
            type: "HasMany",
            key: "fields",
            relatedModel: "Application.Field.Model",
            collectionType: "Application.Field.Collection",
            collectionOptions: function(model) {
                return {
                    url: '/api/Entity/' + model.id + '/fields'
                };
            }
        },

        ],

        //validation:
        validation: {

            name: {
                required: true,
                rangeLength: [1, 32]
            },

        },

        //form:
        schema: {

            name: {
                type: "Text",
                title: "Model"
            },

            description: {
                type: "TextArea"
            },

            type: {
                type: "Select",
                options: [{
                    val: "table",
                    label: "Table"
                },

                {
                    val: "complex",
                    label: "Complex"
                }]
            },

            fields: {
                type: "CUSTOM_GRID",
                header: ["name", "label", "type", "editor"],
                moduleRef: "Field"
            },

        },

        initialize: function(data, options) {
            this.urlRoot = (options && (options.urlRoot || options.url)) || '/api/Entity';
        }

    });


    /**
     *
     * **Collection**
     * 
     * Backbone.PageableCollection is a strict superset of Backbone.Collection
     * We instead use the Backbone.PageableCollection for better paginate ability.
     *
     * @class Application.Entity.Collection
     */
    module.Collection = Backbone.PageableCollection.extend({

        //model ref
        model: module.Model,
        parse: function(response) {
            return response.payload; //to use mers on server.
        },

        //register sync event::
        initialize: function(data, options) {
            //support for Backbone.Relational - collectionOptions
            this.url = (options && options.url) || '/api/Entity';
            this.on('error', function() {
                Application.error('Server Error', 'API::collection::Entity');
            })
        }

    });

    /**
     * **collection** 
     * An instance of Application.Entity.Collection
     * This collection is not nested in other models.
     * 
     * @type Application.Entity.Collection
     */
    module.collection = new module.Collection();


    /**
     * Start defining the View objects. e.g,
     *
     * - Single Entry View - for list or grid.
     * - Multi/List View - just wrap around single entry view.
     * - Grid View - with controlls and columns.
     * - Form View - another single entry view but editable. [Generated]
     *
     * - Extension - all the extension/sub-class/sub-comp goes here.
     * 
     * @type {Backbone.View or Backbone.Marionette.ItemView/CollectionView/CompositeView}
     */
    module.View = {};
    module.View.Extension = {};

    /**
     *
     * **View.Form**
     * 
     * Backbone.Marionette.ItemView is used to wrap up the form view and 
     * related interactions. We do this in the onRender callback.
     *
     * @class Application.Entity.View.Form
     */
    module.View.Extension.Form = {};
    module.View.Form = Backbone.Marionette.ItemView.extend({

        template: '#basic-form-view-wrap-tpl',

        className: 'basic-form-view-wrap',

        fieldsets: [
            ["name", "description", "type", "fields"]
        ],

        ui: {
            header: '.form-header-container',
            body: '.form-body-container',
            ctrlbar: '.form-control-bar',
        },

        initialize: function(options) {
            //This is usually a datagrid (view object).
            //We are delegating the create/update action to it.
            this.recordManager = options.recordManager;
        },

        //Might create zombie views...let's see.
        onRender: function() {
            this.form = new Backbone.Form({
                model: this.model,
                fieldsets: this.fieldsets
            });
            this.ui.body.html(this.form.render().el);

            //bind the validators:
            Backbone.Validation.bind(this.form);
        },

        events: {
            'click .btn[action="submit"]': 'submitForm',
            'click .btn[action="cancel"]': 'closeForm',
        },

        //event listeners:
        submitForm: function(e) {
            e.stopPropagation();
            var error = this.form.validate();
            if (error) {
                //output error and scroll to first error field.
                console.log(error);
                for (var key in error) {
                    $('html').animate({
                        scrollTop: this.form.$el.find('.invalid[name=' + key + ']').offset().top - 30
                    },

                    400);
                    break;
                }
            } else {

                //delegating the save/upate action to the recordManager.
                this.model.set(this.form.getValue());
                this.recordManager.$el.trigger('event_SaveRecord', this);
            }
        },

        closeForm: function(e) {
            e.stopPropagation();
            this.close();
            this.recordManager.$el.trigger('event_RefreshRecords');
        }


    });



    /**
     *
     * **View.DataGrid**
     * 
     * Backbone.Marionette.ItemView is used to wrap up the datagrid view and 
     * related interactions. We do this in the onRender callback.
     *
     * @class Application.Entity.View.DataGrid
     */
    module.View.Extension.DataGrid = {};
    module.View.Extension.DataGrid.ActionCell = Backbone.Marionette.ItemView.extend({
        className: 'action-cell',
        template: '#custom-tpl-grid-actioncell',
        initialize: function(options) {
            this.column = options.column;
        },

        //patch-in the id property for action locator.
        onRender: function() {
            this.$el.find('span[action]').attr('target', this.model.id || this.model.cid);
        }
    });

    module.View.DataGrid = Backbone.Marionette.ItemView.extend({

        template: '#basic-datagrid-view-wrap-tpl',

        className: 'basic-datagrid-view-wrap',

        ui: {
            header: '.datagrid-header-container',
            body: '.datagrid-body-container',
            footer: '.datagrid-footer-container'
        },

        columns: [{
            name: "_selected_",
            label: "",
            sortable: false,
            cell: "boolean"
        },

        {
            name: "name",
            label: "Model",
            cell: "string"
        },

        {
            name: "type",
            label: "Type",
            cell: "string"
        },

        {
            name: "_actions_",
            label: "",
            sortable: false,
            cell: module.View.Extension.DataGrid.ActionCell
        }],

        //remember the parent layout. So later on a 'new' or 'modify'
        //event will have a container region to render the form.
        initialize: function(options) {
            this.parentCt = options.layout;
            this.editable = options.editable;
            var that = this;
            _.each(this.columns, function(col) {
                col.editable = that.editable;
            });

        },

        //Add a backgrid.js grid into the body 
        onRender: function() {
            this.grid = new Backgrid.Grid({
                columns: this.columns,
                collection: this.collection
            });

            this.ui.body.html(this.grid.render().el);
            if (!this.parentCt.collectionRef) this.collection.fetch();

            //Do **NOT** register any event listeners here.
            //It might get registered again and again. 
        },

        //datagrid actions DOM-events.
        events: {
            'click .btn[action=new]': 'showForm',
            'click .action-cell span[action=edit]': 'showForm',
            'click .action-cell span[action=delete]': 'deleteRecord',
            'event_SaveRecord': 'saveRecord',
            'event_RefreshRecords': 'refreshRecords',
        },

        //DOM event listeners:
        showForm: function(e) {
            e.stopPropagation();
            var info = e.currentTarget.attributes;

            if (info['target']) {
                //edit mode.
                var m = this.collection.get(info['target'].value);
            } else //create mode.
            var m = new module.Model();

            this.parentCt.detail.show(new module.View.Form({
                model: m,
                recordManager: this
            }));
        },

        saveRecord: function(e, sheet) {
            e.stopPropagation();
            //1.if this grid is used as top-level record holder:
            var that = this;
            if (!this.parentCt.collectionRef) {
                sheet.model.save({},

                {
                    error: function(model, res) {
                        var err = $.parseJSON(res.responseText).error;
                        console.log('!Possible Hack!', err);
                        if (err.db) {
                            //server db error::
                            Application.error('Server DB Error', err.db);
                        }
                        //[optional]TODO::highlight error back to form fields
                    },

                    success: function(model, res) {
                        if (res.payload) {
                            that.collection.fetch();
                            sheet.close();
                        } else Application.error('Server Error', 'Not yet saved...');
                    }
                }); //save the model to server
            } else {
                //2.else if this grid is used as an editor for sub-field:
                //add or update the model into the referenced collection:
                this.collection.add(sheet.model, {
                    merge: true
                });
                sheet.close();
            }
        },

        deleteRecord: function(e) {
            e.stopPropagation();
            var info = e.currentTarget.attributes;
            //find target and ask user
            var m = this.collection.get(info['target'].value);
            //promp user [TBI]
            var that = this;
            Application.prompt('Are you sure?', 'error', function() {
                if (!that.parentCt.collectionRef) m.destroy({
                    success: function(model, resp) {
                        that.collection.fetch(); //refresh
                    },

                    error: function(model, resp) {
                        Application.error('Server Error', 'Can NOT remove this record...');
                    }
                });
                else that.collection.remove(m);
            })
        },

        refreshRecords: function(e) {
            e.stopPropagation();
            if (!this.parentCt.collectionRef) this.collection.fetch();
        }

    });


    /**
     * **View.AdminLayout**
     *
     * Basic Backbone.Marionette.Layout (basically an ItemView with region markers.) to
     * show a datagrid and a form/property grid stacked vertically. This view is mainly
     * there to respond to user's admin menu selection event.
     *
     * @class Application.Entity.View.AdminLayout
     */
    module.View.AdminLayout = Backbone.Marionette.Layout.extend({

        template: '#custom-tpl-module-layout',

        className: 'module-admin-layout-wrap',

        regions: {
            list: '.list-view-region',
            detail: '.details-view-region'
        },

        onRender: function() {
            this.list.show(new module.View.DataGrid({
                collection: module.collection,
                layout: this,
                editable: false //in-place edit default off.
            }));
        }
    });


    /**
     * **View.EditorLayout**
     *
     * This is similar to AdminLayout but only using a different tpl to make datagrid
     * and form slide together thus fit into a parent form.
     *
     * @class Application.Entity.View.EditorLayout
     */
    module.View.EditorLayout = Backbone.Marionette.Layout.extend({
        template: '#custom-tpl-module-layout',

        className: 'module-editor-layout-wrap',

        regions: {
            list: '.list-view-region',
            detail: '.details-view-region'
        },

        initialize: function(options) {
            //This is also used as a flag by datagrid to
            //check if it is working in 'editor-mode'
            this.collectionRef = options.collection;
        },

        onRender: function() {
            this.list.show(new module.View.DataGrid({
                collection: this.collectionRef,
                layout: this,
                editable: false //in-place edit default off.
            }));
        }
    });




})(Application);