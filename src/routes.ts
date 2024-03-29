import express from 'express';
import { latestsNews } from './getLatestsNews';
import { prisma } from './prisma';
import { PrismaClubsRepository } from './repositories/prisma/prisma-clubs-repository';
import { PrismaUsersrepository } from './repositories/prisma/prisma-users-repository';
import { CreateClubUseCase } from './useCases/create-club-use-case';
import { CreateUserUsecase } from './useCases/create-user-use-case';
import { LatestsNewsUseCase } from './useCases/latests-news-use-case';
import { ListClubsUseCase } from './useCases/list-clubs-use-case';

export const routes = express.Router();


routes.post("/clubs", async (req, res) => {
  // const { name, source_url, logo_url, location} = req.body
  const { clubs } = req.body
  const prismaClubsRepository = new PrismaClubsRepository()
  const createClubUseCase = new CreateClubUseCase(prismaClubsRepository);
  console.log(clubs)
  for (const club of clubs) {
    await createClubUseCase.execute({
      name: club.name, 
      source_url: club.source_url, 
      logo_url: club.logo_url, 
      location: club.location
    })
  
  }
  return res.status(201).send()
})

routes.get('/clubs', async(req, res) => {
  const prismaClubsRepository = new PrismaClubsRepository()
  const listClubsUseCase = new ListClubsUseCase(prismaClubsRepository)
  const clubs = await listClubsUseCase.execute()
  
  res.json({ clubs })
})

routes.get('/latestsnews/:club', async(req, res)=> {
  const { club } = req.params
  const prismaClubsRepository = new PrismaClubsRepository()
  const latestsNewsUseCase = new LatestsNewsUseCase(prismaClubsRepository)
  
  const news = await latestsNewsUseCase.execute({club})

  return res.json({data: news})
})

routes.post('/subscription', async(req, res)=> {
  const { email, club_id, first_name, last_name } = req.body
  
  const prismaUserRepository = new PrismaUsersrepository()
  const createUserUsecase = new CreateUserUsecase(prismaUserRepository)
 
  try {
    const user = await createUserUsecase.execute({
      email, 
      club_id, 
      first_name,
      last_name
  })
  return res.status(201).json({user})
} catch (error) {
  return res.status(400).json({error})
}

})

routes.get('/profile/:club', async(req, res)=> {
  const { club } = req.params
  const data = await prisma.club.findFirst({
    where: {
      name: club
    },
    include: {
      fans: true
    }
  })
  return res.json({data})
})

// app.get('/nextfixture', async(req, res)=> {
//   const  { source_url } = req.body

//   const nextFixture = await getNextFixture(source_url).catch(err => err)

//   return res.json({data: nextFixture})
// })




// try {
//   const user = await prisma.user.create({
//   data: {
//     email,
//     club_id,
//     first_name,
//     last_name
//   }
// })
// return res.status(201).json({user})
// } catch (error) {
//   return res.status(400).json({error})
// }