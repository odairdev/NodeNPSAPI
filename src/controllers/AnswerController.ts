import { Request, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import { AppError } from '../Errors/AppErrors'
import { SurveyUserRepository} from '../repositories/SurveyUserRepository'

class AnswerController {

    //http://localhost:3333/answers/10?id=72822eb5-f5f7-470a-9298-5b18dce1fd22

    async execute(request: Request, response: Response) {
        const { value } = request.params
        const { id } = request.query

        if(Number(value) <= 1 || Number(value) > 10) {
            throw new AppError("Value must be between 1 and 10.")
        }

        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const surveyUser = await surveyUserRepository.findOne({id: String(id)})

        if(!surveyUser) {throw new AppError('Survey User Id does not exist.')}

        surveyUser.value = Number(value)

        await surveyUserRepository.save(surveyUser)

        return response.status(200).json(surveyUser)
    }
    
}

export { AnswerController }