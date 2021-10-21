import { app } from '../app';
import * as request from 'supertest';
import { Tournament, Participant } from '../app/api/api-model';

const exampleTournament = {
  id: "123",
} as Tournament;

const exampleParticipant = {
  name: "Novak Djokovic",
  elo: 2500
} as Participant;

describe('/participant endpoint', () => {
  describe('[POST] when creating a participant', () => {
    it('should return the correct id', async () => {
      const { body } = await request(app).post(`/api/tournaments/${exampleTournament.id}/participants`).send(exampleParticipant).expect(201);

      expect(body.id).not.toBeUndefined();
    });

    it('should have a name and a elo', async () => {
      await request(app).post(`/api/tournaments/${exampleTournament.id}/participants`).send({}).expect(400)
      await request(app).post(`/api/tournaments/${exampleTournament.id}/participants`).send({ name: "" }).expect(400)
      await request(app).post(`/api/tournaments/${exampleTournament.id}/participants`).send({ elo: "1" }).expect(400)
    });
  });
});
