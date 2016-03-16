console.log(Backbone) 

//----------------Model------------------//

var HomeModel = Backbone.Model.extend ({

	url: `https://openapi.etsy.com/v2/listings/active.js?includes=Images&api_key=0jiwg9od2dm6mhcggncv05zs&callback=?`

})

var DetailModel = Backbone.Model.extend ({ 
	_makeUrl: function(id) {
		this.url = `https://openapi.etsy.com/v2/listings/${id}.js?includes=Images&api_key=0jiwg9od2dm6mhcggncv05zs&callback=?`
	}
})

// ---------------Views-------------------//

var HomeView = Backbone.View.extend({

	el: "#front",

	initialize: function(someModel) {
		this.model = someModel
		var newFunc = this._render.bind(this)
		this.model.on("sync", newFunc)
	},

	events: { 
		"click img": "_triggerDetailView",
		'keydown input':'_searchByKeyword'
	},

	_searchByKeyword: function (keyEvent){
		var searchTerm = keyEvent.target.value
		if(keyEvent.keyCode === 13){
			location.hash = 'search/' + searchTerm
		}
	},

	_triggerDetailView: function(clickEvent) {
		var imgNode = clickEvent.target
		window.location.hash = "detail/" + imgNode.getAttribute("value")
		console.log(imgNode)
	},

	_render: function(input){
		var dataArray = input.get("results")
		var gifUrlString = `<div id="head-holder"><div id="header"><a href=""id="logo" placeholder="Search for items or shops">Etsy</a><div id="search-box"><div id="search"><input type="text"id="search"></input></div><div id="go"><button>Press Enter...</button></div></div></div></div><div id="container">`
		for (var i = 0; i < dataArray.length - 1; i++) {
			var img = dataArray[i].Images[0].url_fullxfull
			console.log(img)
			console.log(dataArray)
			gifUrlString += `<div id="itemBlock"><img src="${img}" value="${dataArray[i].listing_id}">\
							<div id="scrollDescription">${dataArray[i].description.substr(0, 30)}...</div>
							 <h3 id="cost">${dataArray[i].price}${dataArray[i].currency_code}</h3>
							<h3 id="quantity" > Quantity:${dataArray[i].quantity}</h3></div>`
		}
		console.log(dataArray)
		this.el.innerHTML = gifUrlString + "</div>"
		
	}
	 
})

var DetailView = Backbone.View.extend({
	el: "#front",

	initialize: function(someModel) { 
		this.model = someModel
		var boundRender = this._render.bind(this)
		this.model.on("sync",boundRender)
	},

	events: { 
		"click img": "_triggerScrollView",
		"click button": "_triggerScrollView"
	},

	_triggerScrollView: function(clickEvent) {
		var logoNode = clickEvent.target
		window.location.hash = "scroll"
	},

	_render: function (){
		console.log(this.model)
		var imgObj = this.model.get('results')[0]
		var htmlString = `<button>Go Back</button>`
		var img = imgObj.Images[0].url_fullxfull
		console.log(imgObj)
				 htmlString += `<div id="detailContainer"><div id="imgHolder"><img src="${img}" id="largeImage"></div>\
							    <div id="description"><h1 id="title">${imgObj.title}</h1>\
							   <h1 id="shop"></h1><p id="description">${imgObj.description}</p>\
							   <h3 id="cost">${imgObj.price} ${imgObj.currency_code}</h3>\
							   <h3 id="quantity" > Quantity: ${imgObj.quantity}</h3></div></div>`
			
			this.el.innerHTML = htmlString
	 }
})

//----------------Router-------------------//

var IphyRouter = Backbone.Router.extend ({

	routes: {
		'home': 'handleHomeView',
		'search/:searchTerm': "searchHomeView",
        'detail/:idItem': 'detailsView',
        '*anyroute': 'handleHomeView'
	},

	handleHomeView: function(){
		var mod = new HomeModel()
		var view = new HomeView(mod)
		mod.fetch()
	},

	searchHomeView: function(searchTerm) {
		var mod = new HomeModel()
		var view = new HomeView(mod)
		mod.fetch({
			data:{keywords:searchTerm}
		})
	},

	detailsView: function(id){
		var mod = new DetailModel
			mod._makeUrl(id)
		var view = new DetailView(mod)
			mod.fetch()
	},

	initialize: function(){
		Backbone.history.start()
	}

})

var rtr = new IphyRouter()