import { Request, Response } from 'express';
import { TournamentRepository } from '../repository/tournament-repository';
import { TournamentToAdd } from './api-model';
import { v4 as uuidv4 } from 'uuid';

const tournamentRepository = new TournamentRepository();

export const postTournament = (req: Request, res: Response) => {
  const tournamentToAdd: TournamentToAdd = req.body;

  const tournament = { id: uuidv4(), name: tournamentToAdd.name, phases: [], participants: [] };
  tournamentRepository.saveTournament(tournament);

  if (tournament.name) {
    res.status(201);
    res.send({ id: tournament.id });
  } else {
    res.status(400);
    res.send();
  }
};

export const getTournament = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);

  res.status(200);
  res.send(tournament);
};
