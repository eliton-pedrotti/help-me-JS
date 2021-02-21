import Help from '../models/Help';
import * as Yup from 'yup';
import File from '../models/File';
import HelpImage from '../models/HelpImage';

export default {

    //OK
    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required(),
            value: Yup.number().required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Erro na validação!' });
        }

        const requestImages = req.files;

        const images = requestImages.map(image => {
            return {
                name: image.originalname,
                path: image.filename
            }
        })

        const files = images.map(async image => {
            return await File.create({
                name: image.name,
                path: image.path
            });
        })

        const user_id = req.userId;

        const { title, description, value } = req.body;

        const addHelp = await Help.create({
            title,
            description,
            value,
            user_id,
            files
        });

        const help_id = addHelp.id

        files.map(async image => {
            image.then(async (img) => {
                await HelpImage.create({
                    help_id,
                    file_id: img.id
                });
            })
        });

        return res.json(addHelp);
    },

    //EM ANDAMENTO
    async index(req, res) {

        const { page = 1 } = req.query;

        const helps = await Help.findAll({
            attributes: ['id', 'title', 'description', 'value'],
            limit: 20,
            offset: ((page - 1) * 20)
        });

        // let attributes = ['help_id', ['h.title', 'h.description', 'h.value']];

        // helps.map(async (help) => {

        //     const teste = await HelpImage.findAll({
        //         attributes: attributes,
        //         where: { help_id: help.id }, include: [{ model: Help, as: 'h', attributes: attributes }]
        //     })


        return res.json({
            helps
        })
    },

    //OK
    async delete(req, res) {
        const help = await Help.findByPk(req.params.id);

        if (help.user_id !== req.userId) {
            return res.status(401).json({ error: 'Você nao pode excluir esse help' });
        }

        await help.destroy();

        return res.json({ message: 'Help removido com sucesso!' })
    },

    //EM ANDAMENTO
    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required(),
            value: Yup.number().required()
        })


        const { title, description, value } = req.body

        const data = {
            title,
            description,
            value: Number(value)
        }


        if (!(await schema.isValid(data))) {
            return res.status(400).json({ error: 'Erro na validação!' });
        }


        // const { originalname, filename } = req.file

        const { id } = req.params

        const help = await Help.findByPk(id)


        if (!help) {
            return res.status(400).json({ error: 'Help inexistente' })
        }

        const requestImages = req.files;

        const images = requestImages.map(image => {
            return {
                name: image.originalname,
                path: image.filename
            }
        })


        const file = await help.update(images)


        await Help.update({
            where: {
                id
            }
        }, data);

        return res.json({
            title,
            description,
            value,
        });

    }
}