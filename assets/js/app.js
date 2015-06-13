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
	}
};
