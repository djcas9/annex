# Annex

Annex is a simple client-side router that supports query paramaters based off the Grapnel.js router. 

# Example

Supports basic query params and route params
```javascript
var route = new Annex();

// GET #/example/15?hello=world
route.add('example/:id', function(req, params){
  // req:
  // #=> { id: 15 }
  
  // params
  // #=> { hello: "world" }
});
```

Supports complex query params
```javascript
// GET #/example/26/test?array[]=1&array[]=2&array[]=3
route.add('example/:id/:word', function(req, params){
  // req:
  // #=> { id: 26, word: "test" }
  
  // params
  // #=> { array: [1, 2, 3] }
});
```

slightly more complex
```javascript
// GET #/example/200/omg?array[]=1&array[]=2&array[]=3&params[foo]=1&params[bar]=2&params[baz]=3
route.add('example/:id/:word', function(req, params){
  // req:
  // #=> { id: 200, word: "omg" }
  
  // params
  // #=> { array: [1, 2, 3], params: { foo: 1, bar: 2, baz: 3 } }
});
```


