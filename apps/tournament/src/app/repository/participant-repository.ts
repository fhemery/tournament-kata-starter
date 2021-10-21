import { Participant } from "../api/api-model";

export class ParticipantRepository {
    private participants = new Map<string, Participant>();

    public saveParticipant(participant: Participant): void {
        this.participants.set(participant.id, participant);
    }

    public getParticipant(participantId: string): Participant {
        return this.participants.get(participantId);
    }
}