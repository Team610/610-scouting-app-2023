migrate((db) => {
  const collection = new Collection({
    "id": "539rmrf0ntvy5qa",
    "created": "2023-01-28 21:06:39.657Z",
    "updated": "2023-01-28 21:06:39.657Z",
    "name": "match_data",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nfol0h1z",
        "name": "match_id",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "m2ndsh7d",
        "name": "team_tracked",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "e32x1pyd",
        "name": "cones_picked_up",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "brd95msx",
        "name": "cones_scored",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("539rmrf0ntvy5qa");

  return dao.deleteCollection(collection);
})
