import { Router } from "express";

const adminRouter = Router();

adminRouter.get('/modules', (req, res ) => res.send( {body: {title: 'Get all modules' }}))

adminRouter.get('/modules/:moduleId', (req, res ) => res.send({body: {title: 'Get single module'}}))

adminRouter.post('modules', (req, res) => res.send({body: {title: 'Create new module'}}))

adminRouter.put('/modules/:moduleId', (req, res) => res.send({ body: {title: 'Update specific module'}}))

adminRouter.delete('modules/:moduleId', (req, res) => res.send({body: {title: 'Delete specific module'}}))

adminRouter.get('modules/:moduleId/subsections', (req, res) => ( {body: {title: 'Get all modules subsections'}}))

adminRouter.post('modules/:moduleId/subsections', (req, res) => res.send({body: { title: 'Add a speciic subsection from a speciic module'}}))

adminRouter.get('modules/:moduleId/subsections/:subsectionId', (req, res) => res.send({body: {title: 'Get a specific subsection from a specific module'}}))

adminRouter.put('modules/:moduleId/subsection/:subsectionId', (req, res) => res.send({body: {title: 'Update a specific subsecction from a specific module'}}))

adminRouter.delete('modules/:moduleId/subsections/:subsectionId', (req, res) => res.send({body: { title: 'Delete a speciic subsection from a speciic module'}}))

adminRouter.get('users', (req, res) => res.send({body: {title: "Get all users"}}))

adminRouter.get('analytics') //finish later

export default adminRouter