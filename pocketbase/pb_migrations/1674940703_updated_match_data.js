migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("539rmrf0ntvy5qa")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gnaw6n8d",
    "name": "event_id",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("539rmrf0ntvy5qa")

  // remove
  collection.schema.removeField("gnaw6n8d")

  return dao.saveCollection(collection)
})
