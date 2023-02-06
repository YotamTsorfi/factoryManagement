const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./configs/database');
const authRouter = require('./routers/authRouter');
const employeesRouter = require('./routers/employeesRouter');
const departmentsRouter = require('./routers/departmentsRouter');
const shiftsRouter = require('./routers/shiftsRouter');
const usersRouter = require('./routers/usersRouter');

const app = express();
const port = 8888;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/employees', employeesRouter);
app.use('/departments', departmentsRouter);
app.use('/shifts', shiftsRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, ()=> 
{
    console.log(`App is listening at http://localhost:${port}`);
})
