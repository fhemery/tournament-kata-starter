import {TournamentToAdd} from '../app/api-model';
import {INestApplication} from '@nestjs/common';
import {startApp} from './test.utils';
import * as request from 'supertest';

import {NAME_ALREADY_USED, REQUIRE_NAME} from '../app/errors-messages';


function generateExampleTournament() {
    return {
        name: 'Unreal' + Math.floor(Math.random() * (1000)),
    } as TournamentToAdd;
}

describe('/tournament endpoint', () => {
    let app: INestApplication;
    let exampleTournament;
    beforeAll(async () => {
        app = await startApp();
    });

    beforeEach(() => {
        exampleTournament = generateExampleTournament()
    })

    describe('[POST] when creating a tournament', () => {
        it('should return the correct id', async () => {
            const {body} = await request(app.getHttpServer())
                .post('/api/tournaments')
                .send(exampleTournament)
                .expect(201);

            expect(body.id).not.toBeUndefined();
        });

        it('should have stored the tournament', async () => {
            const {body} = await request(app.getHttpServer())
                .post('/api/tournaments')
                .send(exampleTournament)
                .expect(201);

            const get = await request(app.getHttpServer())
                .get(`/api/tournaments/${body.id}`)
                .expect(200);

            expect(get.body.name).toEqual(exampleTournament.name);
        });

        it('no name for the tournament', async () => {
            const {body} = await request(app.getHttpServer())
                .post('/api/tournaments')
                .send({})
                .expect(400);

            expect(body.error).toEqual(REQUIRE_NAME);
        });

        it('Name is already used', async () => {
            await request(app.getHttpServer())
                .post('/api/tournaments')
                .send(exampleTournament)
                .expect(201);

            const {body} = await request(app.getHttpServer())
                .post('/api/tournaments')
                .send(exampleTournament)
                .expect(400);

            expect(body.error).toEqual(NAME_ALREADY_USED);
        });
    });
});
