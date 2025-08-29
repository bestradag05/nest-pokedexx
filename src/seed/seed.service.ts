import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executedSeed() {

    await this.pokemonModel.deleteMany({}); //delete * from pokemons

    const { data } = await axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    
    const insertPromisesArray : any = [];

    data.results.forEach(async ({ name, url }) => {

      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      /* const pokemon = await this.pokemonModel.create({no, name}); */
      insertPromisesArray.push(this.pokemonModel.create({ no, name }))
    });

    await Promise.all( insertPromisesArray );

    return 'Seed Executed';
  }
}
