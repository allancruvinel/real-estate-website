import { Request, Response } from 'express'
import { getRepository } from 'typeorm';
import Apartment from '../models/Apartment';
import apartmentView from '../views/ApartmentView';
import cloudinaryService from '../services/cloudinaryService';

const cloudinary = require('cloudinary').v2;



export default {
    
    async update(req: Request, res: Response) {
        const { ref } = req.params;
        
        const {
            titulo,
            descricao,
            nrApto,
            nmPredio,
            nrTorre,
            preco,
            cond,
            iptu,
            bairro,
            dtVenc,
            aUtil,
            vGaragem,
            banh,
            suite,
            dorm,
            churras,
            piscina,
            playground,
            poli,
            sFestas,
            sauna,
            sJogos,
            ativo
        } = req.body

        //console.log(req.files);

        
        


        const myimages = req.files as Express.Multer.File[];
        await cloudinaryService.uploadImages(myimages);
        const images = await myimages.map(async image => {
            
            return { path: image.filename }
            
        })



        const data = {
            titulo,
            descricao,
            nrApto,
            nmPredio,
            nrTorre,
            preco,
            cond,
            iptu,
            bairro,
            dtVenc,
            aUtil,
            vGaragem,
            banh,
            suite,
            dorm,
            churras: churras === 'true',
            piscina: piscina === 'true',
            playground: playground === 'true',
            poli: poli === 'true',
            sFestas: sFestas === 'true',
            sauna: sauna === 'true',
            sJogos: sJogos === 'true',
            ativo: ativo === true,

        }

        const apartmentRepository = await getRepository(Apartment);

        const oldimages = await apartmentRepository.query(`select id,path from images where apartment_id=${ref}`);
        cloudinaryService.destroyImages(oldimages);

        const apartment = await apartmentRepository.create(data);

        console.log(apartment);

        try {
            await apartmentRepository.update(ref, apartment);
            await apartmentRepository.query(`delete from images where apartment_id=${ref}`);
            images.map(async image => {
                await apartmentRepository.query(`insert into images (path,apartment_id) values ('${(await image).path}',${ref})`);
            })
            console.log('apartamento de id ' + ref + ' Atualizado');

        } catch (e) {
            console.log('deu erro ' + e)
        }

        return res.status(201).send('updated');

    },

    async index(req: Request, res: Response) {
        const apartmentRepository = await getRepository(Apartment);
        const apartments = await apartmentRepository.find({
            relations: ['images']
        });

        return res.status(200).json(apartmentView.renderMany(apartments));
    },

    async show(req: Request, res: Response) {
        const { ref } = req.params;
        const apartmentRepository = await getRepository(Apartment);

        //forma dificil porem explicativa 
        try {
            const preview = await apartmentRepository.query(`select * from apartments where id=${ref}`);
            const images = await apartmentRepository.query(`select id,path from images where apartment_id=${ref}`);

            const {
                id,
                titulo,
                descricao,
                nrApto,
                nmPredio,
                nrTorre,
                preco,
                cond,
                iptu,
                bairro,
                dtVenc,
                aUtil,
                vGaragem,
                banh,
                suite,
                dorm,
                churras,
                piscina,
                playground,
                poli,
                sFestas,
                sauna,
                sJogos,
                ativo
            } = preview[0];


            const apartment = {
                id,
                titulo,
                descricao,
                nrApto,
                nmPredio,
                nrTorre,
                preco,
                cond,
                iptu,
                bairro,
                dtVenc,
                aUtil,
                vGaragem,
                banh,
                suite,
                dorm,
                churras,
                piscina,
                playground,
                poli,
                sFestas,
                sauna,
                sJogos,
                ativo,
                images
            }
            //forma facil
            /*const apartment = await apartmentRepository.findOne(ref,{relations:['images']}); */
            res.status(200).json(apartmentView.render(apartment));
        } catch (e) {
            console.log('deu erro ' + e);
            return res.status(500).send("Internal Error");
        }
    },

    async apartmentCreate(req: Request, res: Response) {

        const {
            titulo,
            descricao,
            nrApto,
            nmPredio,
            nrTorre,
            preco,
            cond,
            iptu,
            bairro,
            dtVenc,
            aUtil,
            vGaragem,
            banh,
            suite,
            dorm,
            churras,
            piscina,
            playground,
            poli,
            sFestas,
            sauna,
            sJogos,
            ativo,
        } = req.body


        const myimages = await req.files as Express.Multer.File[];
        

        const images = myimages.map(image => {
            
            return { path: image.filename }
        })

        



        const data = {
            titulo,
            descricao,
            nrApto,
            nmPredio,
            nrTorre,
            preco,
            cond,
            iptu,
            bairro,
            dtVenc,
            aUtil,
            vGaragem,
            banh,
            suite,
            dorm,
            churras: churras === 'true',
            piscina: piscina === 'true',
            playground: playground === 'true',
            poli: poli === 'true',
            sFestas: sFestas === 'true',
            sauna: sauna === 'true',
            sJogos: sJogos === 'true',
            ativo: ativo === 'true',
            images
        }

        const apartmentRepository = await getRepository(Apartment);

        const apartment = await apartmentRepository.create(data);

        await cloudinaryService.uploadImages(myimages);
        try {
            await apartmentRepository.save(apartment);
            console.log('Cadastro Realizado!')
        } catch (e) {
            console.log('deu erro ' + e)
        }

        return res.status(201).json(apartment);

        

    },

    async apartmentDelete(req: Request, res: Response) {
        const { ref } = req.params;
        const apartmentRepository = await getRepository(Apartment);
        const images = await apartmentRepository.query(`select id,path from images where apartment_id=${ref}`);
        cloudinaryService.destroyImages(images);
        try {
            await apartmentRepository.delete(ref);
        }
        catch (e) {
            console.log('deu erro ' + e);
        }
        return res.status(202).json({ response: "deleted" });
    }

}