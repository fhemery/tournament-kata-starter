<?php

namespace App\Tests\Acceptance;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use App\Controller\TournamentController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class ParticipantTest extends ApiTestCase
{
    private function createTournament(Client $client): string
    {
        $client->request('POST', '/api/tournaments', [
            'headers' => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            'body' => json_encode(['name' => 'Tournament'])
        ]);

        $response = $client->getResponse()->toArray();

        return $response['id'];
    }

    public function testParticipantCreation(): void
    {
        $client = static::createClient();

        $tournamentId = $this->createTournament($client);

        $client->request('POST', '/api/tournaments/'. $tournamentId .'/participants', [
            'headers' => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            'body' => json_encode([
                'name' => 'Novak Djokovic',
                'elo' => 2500
            ])
        ]);
        $this->assertResponseIsSuccessful();
        $response = $client->getResponse()->toArray();

        $this->assertIsString($response["id"]);
    }

    public function testTournamentDoesNotExist(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/tournaments/' . 10 . '/participants', [
            'headers' => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            'body' => json_encode([
                'name' => 'Novak Djokovic',
                'elo' => 2500
            ])
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testParticipantCreationWithoutGoodParameters(): void
    {
        $client = static::createClient();
        $tournamentId = $this->createTournament($client);

        $client->request('POST', '/api/tournaments/' . $tournamentId . '/participants', [
            'headers' => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            'body' => json_encode([
                'prenom' => 'Novak Djokovic',
                'elo' => 2500
            ])
        ]);


        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }
}
