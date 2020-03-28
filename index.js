const express = require('express');

const server = express();
const port = 3333;

server.use(express.json());
server.listen(port);
console.log(`Servidor rodando na porta ${port}`);

const projects = [];
let totalReqs = 0;

function sumTotalReqs(req, res, next){
  totalReqs++;
  console.log(`Total de requisições: ${totalReqs}`);

  return next();
};

function checkIdAndTitle(req, res, next){
  if (!req.body.id){
    return res.status(400).json({error: 'ID is required'});
  }

  if (!req.body.title){
    return res.status(400).json({error: 'Title is required'});
  }

  return next();
};

function checkProjectExist(req,res,next){
  const { id } = req.params;
  const project = projects.find(p => p.id===id);
  
  if(!project){
    return res.status(400).json({error:'Project not found'});
  }

  return next();

}

server.post('/projects',sumTotalReqs,checkIdAndTitle, (req,res)=>{
  
  const { id, title } = req.body;
  projects.push({
    id: id, 
    title: title,
    tasks:[]
  });

  return res.json(projects);
});

server.get('/projects',sumTotalReqs, (req,res)=>{
  return res.json(projects);
});

server.put('/projects/:id',sumTotalReqs,checkProjectExist, (req,res)=>{
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);

  project.title = title
  return res.json(project);
});

server.delete('/projects/:id', sumTotalReqs, checkProjectExist, (req, res)=>{
  const { id } = req.params;
  const indexProject = projects.findIndex(p=>p.id===id);

  projects.splice(indexProject,1);
  return res.send();
})

server.post('/projects/:id/tasks',sumTotalReqs,checkProjectExist,(req,res)=>{
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p=>p.id===id);

  project.tasks.push(title);

  return res.json(project);
});
