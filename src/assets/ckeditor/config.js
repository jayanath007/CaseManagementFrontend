/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function(config) {
  // Define changes to default configuration here.
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config

  // The toolbar groups arrangement, optimized for two toolbar rows.
  /*config.toolbarGroups = [
    { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
    { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
    { name: 'links' },
    { name: 'insert' },
    { name: 'forms' },
    { name: 'tools' },
    { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'others' },
    '/',
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
    { name: 'styles' },
    { name: 'colors' },
    { name: 'about' }
  ];*/

  config.toolbarGroups = [

    {
      name: 'styles',
      groups: ['styles']
    },
    {
      name: 'colors',
      groups: ['colors']
    },
    {
      name: 'others',
      groups: ['others']
    },
    {
      name: 'about',
      groups: ['about']
    },

    {
      name: 'clipboard',
      groups: ['clipboard', 'undo']
    },
    {
      name: 'editing',
      groups: ['find', 'selection', 'spellchecker', 'editing']
    },

    {
      name: 'basicstyles',
      groups: ['basicstyles', 'cleanup']
    },
    {
      name: 'paragraph',
      groups: ['list', 'indent', 'align', 'bidi', 'paragraph']
    }, //, 'blocks'
    {
      name: 'links',
      groups: ['links']
    },
    {
      name: 'insert',
      groups: ['insert']
    },
  ];
  config.font_names =
    'Arial/Arial;' +
    'Comic Sans MS/Comic Sans MS;' +
    'Courier New/Courier New;' +
    'Georgia/Georgia;' +
    'Lucida Sans Unicode/Lucida Sans Unicode;' +
    'Tahoma/Tahoma;' +
    'Times New Roman/Times New Roman;' +
    'Trebuchet MS/Trebuchet MS;' +
    'Calibri/Calibri;' +
    'Mangal/Mangal;' +
    'Fascinate/Fascinate;' +
    'Fjalla One/Fjalla One;' +
    'Griffy/Griffy;' +
    'Monospace/Monospace;' +
    'Cambria/Cambria;' +
    'Kalinga/Kalinga;' +
    'Candara/Candara;' +
    'DaunPenh/DaunPenh;' +
    'Lucida Console/Lucida Console;' +
    'Helvetica/Helvetica;' +
    'Gungsuh/Gungsuh;' +
    'Verdana/Verdana;';

  config.fontSize_sizes = '8/8pt;9/9pt;10/10pt;11/11pt;12/12pt;14/14pt;16/16pt;18/18pt;20/20pt;22/22pt;24/24pt;26/26pt;28/28pt;36/36pt;48/48pt;72/72pt';

  // Remove some buttons provided by the standard plugins, which are
  // not needed in the Standard(s) toolbar.
  // config.removeButtons = 'Underline,Subscript,Superscript';
  config.removeButtons = 'About,Flash,Iframe,SimpleLink,ShowBlocks,PageBreak,Smiley,Anchor';

  // Set the most common block elements.
  //config.format_tags = 'p;h1;h2;h3;pre';

  // Simplify the dialog windows.
  // config.removeDialogTabs = 'image:advanced;link:advanced';
  // autogrow
  config.removePlugins = 'uploadimage,elementspath,scayt,wsc';
  config.disableNativeSpellChecker = false;
  config.extraPlugins = 'autolink,liststyle,widget,font,find,justify,colorbutton,language,copyformatting,bidi,autogrow';
  config.autoGrow_minHeight = 350;
  config.autoGrow_maxHeight = 600;
  config.imageUploadUrl = '';
  config.enterMode = CKEDITOR.ENTER_BR;
  config.shiftEnterMode = CKEDITOR.ENTER_P;
  config.startupShowBorders = false;
  config.scayt_autoStartup = true;
  config.scayt_sLang = 'en_GB';
  config.allowedContent = true;
  config.disallowedContent = 'script; *[on*]';
  config.extraAllowedContent = 'img[width,height]';
  config.resize_enabled = false;
  config.font_defaultLabel = 'Arial';
  config.fontSize_defaultLabel = '10';
  //	config.contentsCss = ['/assets/ckeditor/file-drop.css']
  // config.height = window;
};
