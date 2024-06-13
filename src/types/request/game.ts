import { Query } from 'express-serve-static-core';

export interface createGame extends Query {
    emotionSelectedId?: string;
    comment?: string;
    opponent? : string
}

export interface createGameTurn extends Query {
    emotionSelectedId?: string;
    emotionSelectedName?: string;
    comment?: string;
    opponent? : string;
    gameId? : string;
}

export interface completeTurn extends Query {
    emotionSelectedId?: string;
    comment?: string;
    opponent? : string
}

export interface guessTurn extends Query {
    turnId : string;
    result : string;
    emotionSelectedId?: string;
    emotionSelectedName?: string;
    comment?: string;
}

export interface turnData extends Query {
    turnId : string;
}


export interface lifelineType extends Query {
    lifeline : string;
}