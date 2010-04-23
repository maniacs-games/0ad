function ResourceSupply() {}

ResourceSupply.prototype.Schema =
	"<a:help>Provides a supply of one particular type of resource.</a:help>" +
	"<a:example>" +
		"<Amount>1000</Amount>" +
		"<Type>food.meat</Type>" +
	"</a:example>" +
	"<element name='Amount' a:help='Amount of resources available from this entity'>" +
		"<data type='nonNegativeInteger'/>" +
	"</element>" +
	"<element name='Type' a:help='Type of resources'>" +
		"<choice>" +
			"<value>wood</value>" +
			"<value>stone</value>" +
			"<value>metal</value>" +
			"<value>food.fish</value>" +
			"<value>food.fruit</value>" +
			"<value>food.grain</value>" +
			"<value>food.meat</value>" +
			"<value>food.milk</value>" +
		"</choice>" +
	"</element>";

ResourceSupply.prototype.Init = function()
{
	// Current resource amount (non-negative; can be a fractional amount)
	this.amount = this.GetMaxAmount();
};

ResourceSupply.prototype.GetMaxAmount = function()
{
	return +this.template.Amount;
};

ResourceSupply.prototype.GetCurrentAmount = function()
{
	return this.amount;
};

ResourceSupply.prototype.TakeResources = function(rate)
{
	// Internally we handle fractional resource amounts (to be accurate
	// over long periods of time), but want to return integers (so players
	// have a nice simple integer amount of resources). So return the
	// difference between rounded values:

	var old = this.amount;
	this.amount = Math.max(0, old - rate);
	var change = Math.ceil(old) - Math.ceil(this.amount);
	// (use ceil instead of floor so that we continue returning non-zero values even if
	// 0 < amount < 1)
	return { "amount": change, "exhausted": (old == 0) };
};

ResourceSupply.prototype.GetType = function()
{
	if (this.template.Type.indexOf('.') == -1)
	{
		return { "generic": this.template.Type };
	}
	else
	{
		var [type, subtype] = this.template.Type.split('.');
		return { "generic": type, "specific": subtype };
	}
};

Engine.RegisterComponentType(IID_ResourceSupply, "ResourceSupply", ResourceSupply);
