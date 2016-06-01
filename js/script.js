console.log(Backbone)

//----------------Model------------------//

var HomeModel = Backbone.Model.extend ({

    url: 'https://openapi.etsy.com/v2/listings/active.js?includes=Images,Shop&api_key=aavnvygu0h5r52qes74x9zvo&callback=?'
})

var DetailModel = Backbone.Model.extend ({
	_makeUrl: function(id) {
		this.url = 'https://openapi.etsy.com/v2/listings/'+ id +'.js?includes=Images,Shop&api_key=aavnvygu0h5r52qes74x9zvo&callback=?'
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
		'keydown input':'_searchByKeyword',
        "click button": "_searchByKeyword"
	},

	_searchByKeyword: function (keyEvent){
		var searchTerm = keyEvent.target.value
        console.log(searchTerm)
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
		var gifUrlString = `<div id="header">
			<a href="" id="logo" placeholder="Search for items or shops">Etsy</a>
			<div id="search-box">
				<div id="search">
					<input type="text"id="search">
					</input>
				</div>
				<div id="go">
					<button>Press Enter...</button>
				</div>
			</div>
		</div>
        <div id="category-bar">
          <ul>
            <a class="categories" href="#search/Clothing & Accessories">
              <li>Clothing & Accessories</li>
           </a>
           <a class="categories" href="#search/Jewelry">
              <li>Jewelry</li>
           </a>
           <a class="categories" href="#search/Craft Supplies & Tools">
              <li>Craft Supplies & Tools</li>
           </a>
           <a class="categories" href="#search/Weddings">
              <li>Weddings</li>
           </a>
           <a class="categories" href="#search/Entertainment">
              <li>Entertainment</li>
           </a>
           <a class="categories" href="#search/Home & Living">
              <li>Home & Living</li>
           </a>
           <a class="categories" href="#search/Kids & Baby">
              <li>Kids & Baby</li>
           </a>
           <a class="categories" href="#search/Vintage">
              <li>Vintage</li>
           </a>
        </ul>
        </div>
        <img class="backgroundPic" src="./Etspic.jpg" />
        <h1 class="sloganTop">Whoever you are, </h1>
        <h1 class="sloganBottom">find whatever you're into.</h1>
        </div><div class="item-view">`
		for (var i = 0; i < dataArray.length - 1; i++) {
			var img = dataArray[i].Images[0].url_fullxfull
			console.log(img)
			console.log(dataArray)
			gifUrlString += `<div class="itemBlock"><a><img class="list-img" src="${img}" value="${dataArray[i].listing_id}"></a>
                            <div class="info-holds">
							<div class="scrollDescription ellipsis">${dataArray[i].description.substr(0, 30)}...</div>
							<span class="madeBy" >${dataArray[i].Shop.shop_name}</span>
                            <span id="cost">${dataArray[i].price}$</span></div></div>`
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
		var htmlString = ``
		var img = imgObj.Images[0].url_fullxfull
		console.log(imgObj)
				 htmlString += `<div id="detailContainer"><button class="backb">Go Back</button><div id="imgHolder"><img src="${img}" id="largeImage"></div>\
							    <div id="description-contains"><h3 id="title">${imgObj.title}</h3>\
							   <h1 id="shop"></h1><p id="description">${imgObj.description}</p>\
							   <h3 id="cost">${imgObj.price} ${imgObj.currency_code}</h3>\
							   <h4 id="quantity">Quantity: ${imgObj.quantity}</h4></div></div>`

			this.el.innerHTML = htmlString
	 }
})

//----------------Router-------------------//

var Router = Backbone.Router.extend ({

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

var rtr = new Router()
