import {Person} from './person';

export interface Cast extends Person {

  cast_id: number;

  character: string;

  credit_id: string;

  order: number;

}
