#TinyMce Helper	

This is a handy Blaze block helper for everyone trying to use TinyMce in Meteor.
The main intent is to make inline or in place editing easy and possible in Blaze.

## Getting started

Just wrap the part you want to edit with the TinyMce block helper to make it editable
All elements with the editable class will be editable

	{{#TinyMce}}
		<h2 class="editable">{{{reactiveTitle}}}</h2>
	{{/TinyMce}}


### Defaults
The helper will init TinyMce as a default with

	{
		selector: '.editable',
		inline: true	
	}

### Init Options
To pass in init options you should return them in a Template helper and pass them to the block helper.
Please refer to [TinyMce Docs](https://www.tinymce.com/docs/configure/integration-and-setup/) for all options.
For example:

	Template.hello.helpers({
		myInitSettings: function(){
		    return {
		      toolbar: false,
		      menubar: false,
		      nowrap:true
		    }
		}
	  })


	{{#TinyMce init=myInitSettings}}
		<h2 class="editable">{{{reactiveTitle}}}</h2>
	{{/TinyMce}}


### Saving the result
To save the changed HTML or String to your database you should provide a onSave function.
This function will get called as soon as TinyMce saves the changes.

To pass in a function you have to return it via your template helper.
The first parameter will be the new resulting String.

	Template.hello.helpers({
		saveTitle: function(){
		  return function(newTitle){
		    Session.set('title', newTitle);
		  }
		}
	})


	{{#TinyMce init=myInitSettings onSave=saveTitle}}
		<h2 class="editable">{{{reactiveTitle}}}</h2>
	{{/TinyMce}}


## Contribution
Please report all issues and feature request.
If you are interested in improving this package please contact me.