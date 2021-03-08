import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UsersRepository';
import * as yup from 'yup'
import { AppError } from '../Errors/AppErrors';

class UserController {

    async create(request: Request, response: Response) {
        const { name, email } = request.body

        const schema = yup.object().shape({
            name: yup.string().required('Nome Obrigatório'),
            email: yup.string().email().required('Email invalido')
        })

        try {
            await schema.validate(request.body, {abortEarly: false})
        } catch (err) {
            return response.status(400).json({error: err})
        }

        const usersRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if (userAlreadyExists) {
            throw new AppError("User email already exists.")
        }

        const user = usersRepository.create({
            name,
            email
        })

        await usersRepository.save(user);

        return response.status(201).json(user)
    }
}

export default UserController