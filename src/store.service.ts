/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import expressionToTree from './expression-parser/expressionToTree';

@Injectable()
export class StoreService {
  private memoryStore: Array<Record<string, string>> = new Array<Record<string, string>>();

  getStore(query: string): any[] {
    const result = this.memoryStore.filter((obj) => expressionToTree(query, obj).calc());
    return result;
  }

  postStore(objToSave: Record<string, string>): void {
    // Removing object if already exists 
    const existingObject = this.memoryStore.find(obj => parseInt(obj.id) == parseInt(objToSave.id));
    if (existingObject) {
      this.memoryStore = this.memoryStore.filter(obj => obj.id !== objToSave.id);
    } 

    this.memoryStore.push(objToSave);
  }
}
