import express from 'express'
import { login } from '../controller/adminController.js'

const router = express.Router();

router.post('/auth/login', login)

export default router;