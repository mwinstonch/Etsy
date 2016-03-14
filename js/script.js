console.log(Backbone) 


//----------------Model------------------//


var HomeModel = Backbone.Model.extend ({


url: "https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&details=images"

})

var DetailModel = Backbone.Model.extend ({ 
})

// ---------------Views-------------------//


var HomeView = Backbone.View.extend({
	el: "#container",


	initialize: function(someModel) {
		this.model = someModel
		var newFunc = this._render.bind(this)
		this.model.on("sync", this._render)
	},


	events: {
		"click img": "_triggerDetailView"

	},	


	_triggerDetailView: function(clickEvent) {
		var imgNode = clickEvent.target
		location.hash = "detail/" + imgNode.getAttribute("gifId")
		console.log(clickEvent.target)
	},


	_render: function(){
		var dataArray = this.model.get("data")
		var gifUrlString = ""
		console.log(dataArray)
	}
	 
})


//----------------Router-------------------//


var IphyRouter = Backbone.Router.extend ({

	routes: {
		'home': 'handleHomeView',
        'details/:idItem': 'detailsView',
        '*anyroute': 'handleHomeView'
	},


	handleHomeView: function(query){
		var mod = new HomeModel()
		var view = new HomeView(mod)
		
		mod.fetch({
			dataType:"jsonp", 
			data:{
				api_key: mod.apiKey,
				callback:"?"
			}
		})
	},

	detailsView: function(query){

	},

	initialize: function(){
		Backbone.history.start()
	}

})

var rtr = new IphyRouter()