import { Router } from "express";

const userRouter = Router();


// GET /users --> get all users
// GET /users/:id --> get user by id
// POST /users --> create a new user
// PUT /users/:id --> update user by id
// DELETE /users/:id --> delete user by id


userRouter.get('/', (req, res) => { res.send({title: 'GET all user'}); });
userRouter.get('/:id', (req, res) => { res.send({title: 'GET user details'}); });
userRouter.post('/', (req, res) => { res.send({title: 'CREATE a new user'}); });
userRouter.put('/:id', (req, res) => { res.send({title: 'UPDATE user'}); });
userRouter.delete('/:id', (req, res) => { res.send({title: 'DELETE user'}); });

export default userRouter;