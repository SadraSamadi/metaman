import {Person} from './person';

export interface Crew extends Person {

  credit_id: string;

  department: string;

  job: string;

}
