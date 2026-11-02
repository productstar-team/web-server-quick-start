const fs=require('node:fs');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
const {validateUrl,fetchData}=require('../services/apiService');
const file=path.join(__dirname,'../data/urls.json');
const read=()=>JSON.parse(fs.readFileSync(file,'utf8'));
const write=items=>fs.writeFileSync(file,JSON.stringify(items,null,2));
exports.list=(_req,res)=>res.json(read());
exports.get=(req,res)=>{
 const item=read().find(x=>x.id===req.params.id);
 return item?res.json(item):res.status(404).json({error:'Not found'});
};
exports.create=(req,res)=>{
 let url;try{url=validateUrl(req.body?.url);}catch(e){return res.status(400).json({error:e.message});}
 const items=read();
 if(items.some(x=>x.url===url))return res.status(409).json({error:'URL already exists'});
 const item={id:randomUUID(),url};items.push(item);write(items);return res.status(201).json(item);
};
exports.update=(req,res)=>{
 let url;try{url=validateUrl(req.body?.url);}catch(e){return res.status(400).json({error:e.message});}
 const items=read(),item=items.find(x=>x.id===req.params.id);
 if(!item)return res.status(404).json({error:'Not found'});
 if(items.some(x=>x.url===url && x.id!==item.id))return res.status(409).json({error:'URL already exists'});
 item.url=url;write(items);return res.json(item);
};
exports.remove=(req,res)=>{
 const items=read(),index=items.findIndex(x=>x.id===req.params.id);
 if(index<0)return res.status(404).json({error:'Not found'});
 items.splice(index,1);write(items);return res.status(204).end();
};
exports.aggregate=async(_req,res)=>{
 const items=read();
 const results=await Promise.all(items.map(async item=>{
  try{return {id:item.id,url:item.url,success:true,...await fetchData(item.url)};}
  catch(e){return {id:item.id,url:item.url,success:false,error:e.message};}
 }));
 return res.json({total:results.length,successful:results.filter(x=>x.success).length,results});
};
