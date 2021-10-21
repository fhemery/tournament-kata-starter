import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Tournament, TournamentToAdd } from '../../api-model';
import { v4 as uuidv4 } from 'uuid';
import { TournamentRepositoryService } from '../../repositories/tournament-repository.service';

@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentRepository: TournamentRepositoryService) {}

  @Post()
  public createTournament(@Body() tournamentToAdd: TournamentToAdd): {
    id: string;
  } {
    const { name } = tournamentToAdd;

    const tournament = {
      id: uuidv4(),
      name,
      phases: [],
      participants: [],
    };

    if (!name)
      throw new HttpException(
        'Tournament must have a name',
        HttpStatus.BAD_REQUEST
      );

    this.tournamentRepository.saveTournament(tournament);

    return { id: tournament.id };
  }

  @Get(':id')
  public getTournament(@Param('id') id: string): Tournament {
    return this.tournamentRepository.getTournament(id);
  }
}
