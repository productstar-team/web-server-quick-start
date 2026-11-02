const swaggerJSDoc=require('swagger-jsdoc');
const urlSchema={type:'object',required:['url'],properties:{url:{type:'string',format:'uri',example:'https://jsonplaceholder.typicode.com/users/1'}}};
const responses={400:{description:'Invalid URL'},404:{description:'Not found'},409:{description:'Duplicate URL'}};
const idParam={name:'id',in:'path',required:true,schema:{type:'string'}};
module.exports=swaggerJSDoc({definition:{
 openapi:'3.0.0',info:{title:'URL Aggregator',version:'1.0.0'},
 servers:[{url:'http://localhost:3000'}],
 paths:{
  '/api/urls':{
   get:{summary:'List URLs',responses:{200:{description:'URL list'}}},
   post:{summary:'Create URL',requestBody:{required:true,content:{'application/json':{schema:urlSchema}}},responses:{201:{description:'Created'},...responses}}
  },
  '/api/urls/aggregate':{get:{summary:'Fetch and combine all saved API URLs',description:'Returns one object with results from all URLs, including cached data and per-URL errors.',responses:{200:{description:'Aggregated result with total, successful and results fields'}}}},
  '/api/urls/{id}':{
   get:{summary:'Get URL',parameters:[idParam],responses:{200:{description:'Found'},404:{description:'Not found'}}},
   put:{summary:'Update URL',parameters:[idParam],requestBody:{required:true,content:{'application/json':{schema:urlSchema}}},responses:{200:{description:'Updated'},...responses}},
   delete:{summary:'Delete URL',parameters:[idParam],responses:{204:{description:'Deleted'},404:{description:'Not found'}}}
  }
 }
},apis:[]});
