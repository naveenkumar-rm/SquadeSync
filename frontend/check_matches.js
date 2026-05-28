const fs = require('fs');

fetch('http://localhost:8081/api/matches')
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
