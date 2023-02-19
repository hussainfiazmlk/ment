const data =  {
    archieve: false,
    createdBy: '63f0722fb49d99f5f3b87a6c',
    createdAt: '2023-02-19T10:46:23.656Z',
    name: 'product 14 name',
    description: 'product 14 description',
    price: 50,
    _id: new ObjectId("63f1fe374794f72fa6cebfb7")
};
  
  
const include = [ '_id', 'name', 'description', 'price' ];

const newRecord = Object.fromEntries(Object.keys(data).filter(key => readPermissions.includes(key)).map(key => [key, data[key]]));
  
  