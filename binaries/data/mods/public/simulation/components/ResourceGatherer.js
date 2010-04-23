function ResourceGatherer() {}

ResourceGatherer.prototype.Schema =
	"<a:help>Lets the unit gather resources from entities that have the ResourceSupply component.</a:help>" +
	"<a:example>" +
		"<BaseSpeed>1.0</BaseSpeed>" +
		"<Rates>" +
			"<food.fish>1</food.fish>" +
			"<metal>3</metal>" +
			"<stone>3</stone>" +
			"<wood>2</wood>" +
		"</Rates>" +
	"</a:example>" +
	"<element name='BaseSpeed' a:help='Base resource-gathering rate (in resource units per second)'>" +
		"<ref name='positiveDecimal'/>" +
	"</element>" +
	"<element name='Rates' a:help='Per-resource-type gather rate multipliers. If a resource type is not specified then it cannot be gathered by this unit'>" +
		"<interleave>" +
			"<optional><element name='food' a:help='Food gather rate (may be overridden by \"food.*\" subtypes)'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='wood' a:help='Wood gather rate'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='stone' a:help='Stone gather rate'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='metal' a:help='Metal gather rate'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='food.fish' a:help='Fish gather rate (overrides \"food\")'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='food.fruit' a:help='Fruit gather rate (overrides \"food\")'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='food.grain' a:help='Grain gather rate (overrides \"food\")'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='food.meat' a:help='Meat gather rate (overrides \"food\")'><ref name='positiveDecimal'/></element></optional>" +
			"<optional><element name='food.milk' a:help='Milk gather rate (overrides \"food\")'><ref name='positiveDecimal'/></element></optional>" +
		"</interleave>" +
	"</element>";

ResourceGatherer.prototype.Init = function()
{
};

ResourceGatherer.prototype.GetGatherRates = function()
{
	var ret = {};
	for (var r in this.template.Rates)
		ret[r] = this.template.Rates[r] * this.template.BaseSpeed;
	return ret;
};

ResourceGatherer.prototype.GetRange = function()
{
	return { "max": 4, "min": 0 };
	// maybe this should depend on the unit or target or something?
}

/**
 * Gather from the target entity. This should only be called after a successful range check,
 * and if the target has a compatible ResourceSupply.
 * It should be called at a rate of once per second.
 */
ResourceGatherer.prototype.PerformGather = function(target)
{
	var cmpResourceSupply = Engine.QueryInterface(target, IID_ResourceSupply);
	var type = cmpResourceSupply.GetType();

	var rate;
	if (type.specific && this.template.Rates[type.generic+"."+type.specific])
		rate = this.template.Rates[type.generic+"."+type.specific] * this.template.BaseSpeed;
	else
		rate = this.template.Rates[type.generic] * this.template.BaseSpeed;

	var status = cmpResourceSupply.TakeResources(rate);

	// Give the gathered resources to the player
	var cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
	var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	var cmpPlayer = Engine.QueryInterface(cmpPlayerManager.GetPlayerByID(cmpOwnership.GetOwner()), IID_Player);
	cmpPlayer.AddResource(type.generic, status.amount);
	
	return status;
};


Engine.RegisterComponentType(IID_ResourceGatherer, "ResourceGatherer", ResourceGatherer);
