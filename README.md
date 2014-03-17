# Annex

Annex is a simple client-side router that supports query paramaters based off the Grapnel.js router. 

# Why?

I found myself creating crazy routes to paginate data and passing params like so #/events/1390088285/1395088285/1/100.

OLD
```javascript
route.add('events/:start/:end/:offset/:limit', function(start, end, offset, limit){
  // this sucks and it's a lot to rmemeber and the routes get confusing
});
```

NEW
```javascript
// GET #/events?start=1390088285&end=1395088285&offset=1&count=100
route.add('events', function(req, params){
  // params
  // #=> { start: 1390088285, end: 1395088285, offset: 1, count: 100 }
});
```

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
var route = new Annex();

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
var route = new Annex();

// GET #/example/200/omg?array[]=1&array[]=2&array[]=3&params[foo]=1&params[bar]=2&params[baz]=3
route.add('example/:id/:word', function(req, params){
  // req:
  // #=> { id: 200, word: "omg" }
  
  // params
  // #=> { array: [1, 2, 3], params: { foo: 1, bar: 2, baz: 3 } }
});
```

## License
  * [MIT License](http://opensource.org/licenses/MIT)
  * Props to Grapnel.js - https://github.com/EngineeringMode/Grapnel.js @EngineeringMode


## Todo
  * Clean up everything
  * Add a get function that accepts a callback to fire once the route was successfully loaded.

