import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { Match } from '../matches/match.schema';
export type BetDocument = Bet & Document;
export declare class Bet {
    user: User;
    match: Match;
    homeScore: number;
    awayScore: number;
    points: number;
    processed: boolean;
    resultType: string | null;
}
export declare const BetSchema: import("mongoose").Schema<Bet, import("mongoose").Model<Bet, any, any, any, any, any, Bet>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bet, Document<unknown, {}, Bet, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<User, Bet, Document<unknown, {}, Bet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    match?: import("mongoose").SchemaDefinitionProperty<Match, Bet, Document<unknown, {}, Bet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    homeScore?: import("mongoose").SchemaDefinitionProperty<number, Bet, Document<unknown, {}, Bet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    awayScore?: import("mongoose").SchemaDefinitionProperty<number, Bet, Document<unknown, {}, Bet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    points?: import("mongoose").SchemaDefinitionProperty<number, Bet, Document<unknown, {}, Bet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    processed?: import("mongoose").SchemaDefinitionProperty<boolean, Bet, Document<unknown, {}, Bet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resultType?: import("mongoose").SchemaDefinitionProperty<string | null, Bet, Document<unknown, {}, Bet, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Bet>;
