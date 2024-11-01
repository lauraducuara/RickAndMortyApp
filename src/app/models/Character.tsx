// models/Character.ts
export class Character {
    public id: number;              
    public name: string;             
    public status: string;           
    public species: string;         
    public type: string;             
    public gender: string;          
    public origin: {
        name: string;               
        url: string;                
    };
    public location: {
        name: string;               
        url: string;                
    };
    public image: string;            
    public episode: string[];        
    public url: string;              
    public created: string;          

    constructor(
        id: number,
        name: string,
        status: string,
        species: string,
        type: string,
        gender: string,
        origin: { name: string; url: string },
        location: { name: string; url: string },
        image: string,
        episode: string[],
        url: string,
        created: string
    ) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.species = species;
        this.type = type;
        this.gender = gender;
        this.origin = origin;
        this.location = location;
        this.image = image;
        this.episode = episode;
        this.url = url;
        this.created = created;
    }
}
