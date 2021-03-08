import { Router } from 'express'
import SurveysController from './controllers/SurveyController';
import UserController from './controllers/UserController';
import { AnswerController } from './controllers/AnswerController'
import { SendMailController } from './controllers/SendMailController'
import { NpsController } from './controllers/NpsController';

const routes = Router();

const userConstroller = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController()
const npsController = new NpsController();

routes.post('/users', userConstroller.create);

routes.get('/surveys', surveysController.show)
routes.post('/surveys', surveysController.create)

routes.post('/sendMail', sendMailController.execute)

routes.get('/answers/:value', answerController.execute)

routes.get('/nps/:survey_id', npsController.execute)

export { routes }