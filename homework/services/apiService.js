const HOSTS=new Set(['jsonplaceholder.typicode.com','dummyjson.com']);
const cache=new Map();
const TTL=60_000;
function validateUrl(value) {
 if(typeof value!=='string') throw new Error('URL must be a string');
 let u; try {u=new URL(value);} catch {throw new Error('Invalid URL');}
 if(u.protocol!=='https:' || !HOSTS.has(u.hostname) || u.port || u.username || u.password)
  throw new Error('Only HTTPS URLs on jsonplaceholder.typicode.com or dummyjson.com are allowed');
 return u.href;
}
async function fetchData(value) {
 const url=validateUrl(value), hit=cache.get(url);
 if(hit && hit.expires>Date.now()) return {data:hit.data,cached:true};
 const response=await fetch(url,{signal:AbortSignal.timeout(5000),redirect:'error'});
 if(!response.ok) throw new Error(`External API returned ${response.status}`);
 if(!(response.headers.get('content-type')||'').includes('application/json'))
  throw new Error('Expected JSON response');
 const data=await response.json();
 if(!data || typeof data!=='object' || Array.isArray(data)) throw new Error('Expected a JSON object');
 cache.set(url,{data,expires:Date.now()+TTL});
 return {data,cached:false};
}
module.exports={validateUrl,fetchData};
