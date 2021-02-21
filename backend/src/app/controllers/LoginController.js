import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import * as Yup from 'yup';


export default {

    //OK
    async store(req, res) {

        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Erro na validação!'});
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Usuário inexistente!' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'A senha não confere' });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        });

    }
};
