import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

export default {

    //OK
    async store(req, res) {

        const schema = Yup.object().shape({
            name: Yup.string().required('Nome inválido!'),
            email: Yup.string().email().required('Digite um email válido'),
            password: Yup.string().required('A senha precisa de no mínimo 6 dígitos').min(6)
        });

        if (!(await schema.validate(req.body, { abortEarly: false, strict: true }))) {
            return res.status(400).json({ error: 'Erro na validação!' });
        }

        const { name, email, password } = req.body

        const emailExists = await User.findOne({ where: { email } });

        const userExists = await User.findOne({ where: { name } });

        if (emailExists) {
            return res.status(400).json({ error: 'Usuário existente!' });
        }

        if (userExists) {
            return res.status(400).json({ error: 'Usuário existente!' });
        }


        const { originalname, filename } = req.file

        const file = await File.create({
            name: originalname,
            path: filename
        })

        const avatar_id = file.id;

        await User.create({ name, email, password, avatar_id });


        return res.json({
            name,
            email,
            avatar_id
        });
    },

    //OK
    async update(req, res) {

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            )
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Erro na validação!' });
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email !== user.email) {

            const emailExists = await User.findOne({ where: { email } });

            if (emailExists) {
                return res.status(400).json({ error: 'Usuário existente!' });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'A senha não corresponde com a senha antiga!' });

        }

        const { originalname, filename } = req.file

        const avatar = await File.findByPk(user.avatar_id)

        const file = await avatar.update({
            name: originalname,
            path: filename
        })

        const { id, name } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
            avatar_id: file.id
        });
    }
};
