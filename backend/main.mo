import Bool "mo:base/Bool";
import Func "mo:base/Func";
import List "mo:base/List";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor {
  // Define the structure for a shopping list item
  type ShoppingItem = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  // Stable variable to store the shopping list
  stable var shoppingList: [ShoppingItem] = [];
  stable var nextId: Nat = 0;

  // Function to add a new item to the shopping list
  public func addItem(text: Text) : async Nat {
    let newItem: ShoppingItem = {
      id = nextId;
      text = text;
      completed = false;
    };
    shoppingList := Array.append(shoppingList, [newItem]);
    nextId += 1;
    nextId - 1
  };

  // Function to get all items in the shopping list
  public query func getItems() : async [ShoppingItem] {
    shoppingList
  };

  // Function to mark an item as completed
  public func completeItem(id: Nat) : async Bool {
    shoppingList := Array.map<ShoppingItem, ShoppingItem>(
      shoppingList,
      func (item) {
        if (item.id == id) {
          return {
            id = item.id;
            text = item.text;
            completed = true;
          };
        };
        item
      }
    );
    true
  };

  // Function to delete an item from the shopping list
  public func deleteItem(id: Nat) : async Bool {
    let updatedList = Array.filter<ShoppingItem>(
      shoppingList,
      func (item) { item.id != id }
    );
    if (shoppingList.size() != updatedList.size()) {
      shoppingList := updatedList;
      true
    } else {
      false
    }
  };
}
