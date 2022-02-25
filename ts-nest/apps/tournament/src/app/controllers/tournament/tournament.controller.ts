import {BadRequestException, Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Tournament, TournamentToAdd} from '../../api-model';
import {v4 as uuidv4} from 'uuid';
import {TournamentRepositoryService} from '../../repositories/tournament-repository.service';
import {name_already_used, require_name} from "../../errors-messages";

@Controller('tournaments')
export class TournamentController {
  constructor(private tournamentRepository: TournamentRepositoryService) {
  }

  @Post()
  public createTournament(@Body() tournamentToAdd: TournamentToAdd): {
    id: string;
  } {
    if (tournamentToAdd.name == null) {
      throw new BadRequestException(400, require_name);
    }
    this.tournamentRepository.getTournaments().forEach((value, key) => {
      if (value.name === tournamentToAdd.name) {
        throw new BadRequestException(400, name_already_used);
      }
    })


    const tournament = {
      id: uuidv4(),
      name: tournamentToAdd.name,
      phases: [],
      participants: [],
    };
    this.tournamentRepository.saveTournament(tournament);

    return {id: tournament.id};
  }

  @Get(':id')
  public getTournament(@Param('id') id: string): Tournament {
    return this.tournamentRepository.getTournament(id);
  }
}
