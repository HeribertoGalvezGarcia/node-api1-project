const express = require('express');
const shortid = require('shortid');

const server = express();
server.use(express.json());

let users = [
  {
    id: shortid.generate(),
    name: 'John Doe',
    bio: 'Anonymous Male'
  },
  {
    id: shortid.generate(),
    name: 'Jane Doe',
    bio: 'Anonymous Female'
  }
];

server.post('/api/users', ({body: {name, bio}}, res) => {
  if (name === undefined || bio === undefined) {
    return res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
  }

  const user = {
    id: shortid.generate(),
    name,
    bio
  };

  try {
    users.push(user);
    res.status(201).json(user);
  } catch {
    res.status(500).json({errorMessage: 'There was an error while saving the user to the database.'})
  }
});

server.get('/api/users', (req, res) => {
  try {
    res.status(200).json(users);
  } catch {
    res.status(500).json({errorMessage: 'The users information could not be retrieved.'});
  }
});

server.get('/api/users/:id', ({params: {id}}, res) => {
  let user;

  try {
    user = users.find(({id: userID}) => id === userID);
  } catch {
    return res.status(500).json({errorMessage: 'The user information could not be retrieved.'});
  }

  if (!user) return res.status(404).json({message: 'The user with the specified ID does not exist.'});

  res.status(200).json(user);
});

server.delete('/api/users/:id', ({params: {id}}, res) => {
  let user;

  try {
    user = users.find(({id: userID}) => id === userID);
  } catch {
    return res.status(500).json({errorMessage: 'The user information could not be retrieved.'});
  }

  if (!user) return res.status(404).json({message: 'The user with the specified ID does not exist.'});

  try {
    users = users.filter(({id: userID}) => id !== userID);
  } catch {
    return res.status(500).json({errorMessage: 'The user could not be removed.'});
  }

  res.status(200).json({message: 'User deleted.'});
});

server.listen(8000, () => console.log('API running on port 8000'));
