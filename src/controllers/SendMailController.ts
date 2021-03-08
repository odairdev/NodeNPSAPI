import {Request, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import SurveysRepository from '../repositories/SurveysRepository'
import { SurveyUserRepository } from '../repositories/SurveyUserRepository'
import UsersRepository from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'
import { resolve } from 'path'
import { AppError } from '../Errors/AppErrors'

class SendMailController {

    async execute(request: Request, response:Response) {
        const { email, survey_id } = request.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const user = await usersRepository.findOne({email})

        if (!user) {
            throw new AppError("User Email does not exist.")
        }

        const survey = await surveysRepository.findOne({
            id: survey_id
        })

        if (!survey) {
            throw new AppError('Survey does not exist.')
        }

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: {user_id: user.id, survey_id: survey.id},
            relations: ["user", "survey"]
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: null,
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id
            await SendMailService.execute(email, variables, npsPath)
            return response.json(surveyUserAlreadyExists)
        }

        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id: survey.id,
        })

        await surveyUserRepository.save(surveyUser)

        variables.id = surveyUser.id

        await SendMailService.execute(email, variables, npsPath)

        return response.json(surveyUser)

    }
}

export { SendMailController }