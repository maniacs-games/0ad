/*
	DESCRIPTION	: Functions to manipulate objects with a 'list' property
			  (used to handle the items in list, dropdown, etc.)
	NOTES		: To ensure the selection is properly updated, it is important to
			  use these functions and not manually access the list.
*/

// ====================================================================

// Remove the item at the given index (pos) from the given list object (objectName).
function removeItem (objectName, pos)
{
	var list = getGUIObjectByName (objectName).list;
	var selected = getGUIObjectByName (objectName).selected;

	list.splice(pos, 1);

	getGUIObjectByName (objectName).list = list;

	// It's important that we update the selection *after*
	//  we've committed the changes to the list.

	// Update the selected so the same element remains selected.
	if (selected == pos)
	{
		getGUIObjectByName (objectName).selected = -1;
	}
	else
	if (selected > pos)
	{
		getGUIObjectByName (objectName).selected = selected - 1;
	}
}

// ====================================================================

// Add the item at the given index (pos) to the given list object (objectName) with the given value (value).
function addItem (objectName, pos, value)
{
	var list = getGUIObjectByName (objectName).list;
	var selected = getGUIObjectByName (objectName).selected;

	list.splice (pos, 0, value);

	getGUIObjectByName (objectName).list = list;

	// It's important that we update the selection *after*
	//  we've committed the changes to the list.

	// Update the selected so the same element remains selected.
	if (selected >= pos)
	{
		getGUIObjectByName (objectName).selected = selected + 1;
	}
}

// ====================================================================

// Adds an element to the end of the list
function pushItem (objectName, value)
{
	var list = getGUIObjectByName (objectName).list;
	list.push (value);
	getGUIObjectByName (objectName).list = list;
	// No need to update selection
}

// ====================================================================

// Removes the last element
function popItem (objectName)
{
	var selected = getGUIObjectByName (objectName).selected;
	removeItem(objectName, getNumItems(objectName)-1);

	If (selected == getNumItems(objectName)-1)
	{
		getGUIObjectByName(objectName).selected = -1;
	}
}

// ====================================================================

// Retrieves the number of elements in the list
function getNumItems (objectName)
{
	var list = getGUIObjectByName(objectName).list;
	return list.length;
}

// ====================================================================

// Retrieves the value of the item at 'pos'
function getItemValue (objectName, pos)
{
	var list = getGUIObjectByName(objectName).list;
	return list[pos];
}

// ====================================================================

// Retrieves the value of the currently selected item
function getCurrItemValue (objectName)
{
	if (getGUIObjectByName(objectName).selected == -1)
		return "";
	var list = getGUIObjectByName(objectName).list;
	return list[getGUIObjectByName(objectName).selected];
}

// ====================================================================