const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const routes = require('./routes/urls');
const app = express();
app.use(express.json());
app.use('/api/urls', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_req,res) => res.json({message:'URL aggregator',docs:'/api-docs'}));
app.use((err,_req,res,_next) => {
 if (err instanceof SyntaxError && err.status === 400) return res.status(400).json({error:'Invalid JSON'});
 console.error(err); return res.status(500).json({error:'Internal server error'});
});
if (require.main === module) {
 const port=process.env.PORT || 3000;
 app.listen(port,()=>console.log(`http://localhost:${port}/api-docs`));
}
module.exports=app;
