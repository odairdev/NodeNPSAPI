import { Request, Response } from 'express'
import { getCustomRepository, Not, IsNull } from 'typeorm'
import { SurveyUserRepository } from '../repositories/SurveyUserRepository'

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params

        const surveyUsersRepository = getCustomRepository(SurveyUserRepository)

        const surveyUser = await surveyUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractors = surveyUser.filter(survey => {
            return survey.value <= 6
        }).length

        const promoters = surveyUser.filter(survey => {
            return survey.value >= 9
        }).length

        const passives = surveyUser.filter(survey => {
            return survey.value >= 7 && survey.value <= 8
        }).length

        const totalAnswers = surveyUser.length

        const calculate = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(2))

        return response.json({
            detractors,
            promoters,
            passives,
            total: totalAnswers,
            NPS: (calculate + "%")
        })
    }
}

export { NpsController }