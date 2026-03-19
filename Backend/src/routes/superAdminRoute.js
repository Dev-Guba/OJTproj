import express from 'express';

import { handleGetAllEmployees } from '../controller/superAdminController.js';

const route = express.Router();

route.get('/employees', handleGetAllEmployees);

export default route;