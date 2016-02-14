Package.describe({
    name: 'nerdmed:tinymce-helper',
    version: '0.0.2',

    // Brief, one-line summary of the package.
    summary: 'Simple Block Helper for TinyMce in Blaze',

    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/nerdmed/tinymce-helper.git',

    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use(['templating', 'reactive-var', 'jquery']);
    api.use(['teamon:tinymce@4.3.3_1']);
    api.addFiles('tinymce-helper.html', 'client');
    api.addFiles('tinymce-helper.js', 'client');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('nerdmed:tinymce-helper');
    api.addFiles('tinymce-helper-tests.js');
});
