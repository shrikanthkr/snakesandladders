$(document).foundation();
$(document).ready(function(){
	$('body').find('[data-role="page"]').trigger('pageshow');
});
App = {
	core: {},
	register: function(selector,module){
		$( document ).on( "pageshow", "#"+selector, function( event ) {
			module().init();
		});
		this.core[selector] = module;
	},
	render: function(template,target,data) {
		var $template = $('#'+template),
		$target = $('#'+target),
		compiler = Handlebars.compile($template.html()),
		renderString = compiler(data);
		$target.html(renderString);
	}
};
