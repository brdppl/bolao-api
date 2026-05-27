import { Document } from 'mongoose';
export type MatchDocument = Match & Document;
export declare enum MatchStatus {
    SCHEDULED = "scheduled",
    LIVE = "live",
    FINISHED = "finished",
    CANCELLED = "cancelled"
}
export declare enum MatchPhase {
    GROUP = "group",
    ROUND_OF_32 = "round_of_32",
    ROUND_OF_16 = "round_of_16",
    QUARTER_FINAL = "quarter_final",
    SEMI_FINAL = "semi_final",
    THIRD_PLACE = "third_place",
    FINAL = "final"
}
export declare class Match {
    apiMatchId: number;
    homeTeam: string;
    awayTeam: string;
    homeTeamFlag: string;
    awayTeamFlag: string;
    kickoff: Date;
    status: MatchStatus;
    phase: MatchPhase;
    group: string;
    homeScore: number | null;
    awayScore: number | null;
    resultsProcessed: boolean;
    round: number;
}
export declare const MatchSchema: import("mongoose").Schema<Match, import("mongoose").Model<Match, any, any, any, any, any, Match>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Match, Document<unknown, {}, Match, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    apiMatchId?: import("mongoose").SchemaDefinitionProperty<number, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    homeTeam?: import("mongoose").SchemaDefinitionProperty<string, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    awayTeam?: import("mongoose").SchemaDefinitionProperty<string, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    homeTeamFlag?: import("mongoose").SchemaDefinitionProperty<string, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    awayTeamFlag?: import("mongoose").SchemaDefinitionProperty<string, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    kickoff?: import("mongoose").SchemaDefinitionProperty<Date, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<MatchStatus, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phase?: import("mongoose").SchemaDefinitionProperty<MatchPhase, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    group?: import("mongoose").SchemaDefinitionProperty<string, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    homeScore?: import("mongoose").SchemaDefinitionProperty<number | null, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    awayScore?: import("mongoose").SchemaDefinitionProperty<number | null, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resultsProcessed?: import("mongoose").SchemaDefinitionProperty<boolean, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    round?: import("mongoose").SchemaDefinitionProperty<number, Match, Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Match & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Match>;
