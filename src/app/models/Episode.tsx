export class Episode {
    public id: number;
    public name: string;
    public air_date: string;
    public episode: string;
    public characters: string[];
    public url: string;
    public created: string;

    constructor(
        id: number, 
        name: string, 
        airDate: string, 
        episodeCode: string, 
        characters: string[], 
        url: string, 
        created: string
    ) {
        this.id = id;
        this.name = name;
        this.air_date = airDate;
        this.episode = episodeCode;
        this.characters = characters;
        this.url = url;
        this.created = created;
    }
}
