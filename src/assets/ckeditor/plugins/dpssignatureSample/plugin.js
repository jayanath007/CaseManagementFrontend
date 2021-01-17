CKEDITOR.plugins.add( 'dpssignature', {
    icons: 'dpssignature',
    init: function( editor ) {
        //Plugin logic goes here.
        editor.addCommand( 'insertDpssignature', {
            // exec: function( editor ) {
            //     var now = new Date();
            //     editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
            // }

            exec: function (editor) {
                var signature = $parse(iAttrs.dpsCkSignature)(scope);

                var ckjq = jQuery(editor.editable().$);

                if (signature && signature.Signature) {

                    var fwdOrRpyCont = $('#divRplyFwdMsg', ckjq);
                    if (fwdOrRpyCont.length > 0) {
                        var el = fwdOrRpyCont.prev('hr');
                        if (el.length == 0)
                            el = fwdOrRpyCont;
                        if (el.prevAll('.signature').length > 0) {
                            el.prevAll('.signature').remove();
                        }
                        el.before('<div class="signature">' + signature + '</div>');
                    }
                    else {
                        ckjq.find('.signature').remove();
                        ckjq.append('<div class="signature">' + signature + '</div>')
                    }
                }
                scope.$apply();
            },
            canUndo: true

        });

        editor.ui.addButton( 'DpsSignature', {
            label: 'Insert Signature',
            command: 'insertDpssignature',
            toolbar: 'insert'
        });
    }
});