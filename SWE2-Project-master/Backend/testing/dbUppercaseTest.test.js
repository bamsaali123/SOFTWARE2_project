const { MongoClient } = require('mongodb');
require('dotenv').config();
const { convertToUppercase } = require('../helpers/convert'); 

const uri = process.env.connect_DB; 
const dbName = 'test';                 
const collectionName = 'products';      

let client;
let db;
let collection;

beforeAll(async () => {
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  collection = db.collection(collectionName);
});

afterAll(async () => {
  await client.close();
});

test('convert all product names to uppercase and validate', async () => {
    const products = await collection.find({}, { projection: { name: 1 } }).toArray();
  
    for (const product of products) {
      if (product.title) { // Ensure name exists
        const original = product.title;
        const converted = convertToUppercase(original);
        expect(converted).toEqual(original.toUpperCase());
  
        // Optionally: update the DB with the uppercase version
        await collection.updateOne(
          { _id: product._id },
          { $set: { title: converted } }
        );
      } else {
        console.log(`Skipping product with missing name: ${JSON.stringify(product)}`);
      }
    }
  });
  
