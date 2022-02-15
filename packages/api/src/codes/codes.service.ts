import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import * as jwa from 'jwa';
import { Code } from '../model/codes.entity';
import { jwtConstants } from '../auth/constants';
import { CodesDTO } from './codes.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly repo: Repository<Code>,
  ) {}

  // remove all expired codes
  public async checkExpiration(clientId: string): Promise<void> {
    // current date - 10 minutes (600 seconds)
    const unixTenMinAgo = Math.floor(Date.now() / 1000 - 600);
    const dateTenMinAgo = new Date(unixTenMinAgo * 1000);
    await this.repo.delete({
      clientId,
      create_date_time: LessThan(dateTenMinAgo),
    });
  }

  /**
   * Function that return the db code that corresponding to the clientId and the signature pass in params
   * @param {string} clientId The Id of the client
   * @param {string} signature The code receive
   * @returns {Promise<CodesDTO | undefined>} the code finded or not
   */
  public async checkAssociation(
    clientId: string, // The Id of the client
    signature: string, // The code receive
  ): Promise<CodesDTO | undefined> {
    // Initialise json web algo
    const hmac = jwa('HS256');
    // calculate codes that are not expires
    // current date - 10 minutes (600 seconds)
    const unixTenMinAgo = Math.floor(Date.now() / 1000 - 600);
    const dateTenMinAgo = new Date(unixTenMinAgo * 1000);

    // Retreave all non expires code for a specific client
    const allCodes = await this.repo
      .find({
        relations: ['client'],
        where: [{ clientId }, { create_date_time: MoreThan(dateTenMinAgo) }],
      })
      .then((items) => items.map((e) => CodesDTO.fromEntity(e)));
    return allCodes?.filter((c: CodesDTO) =>
      hmac.verify(c.code, signature, jwtConstants.secretCodeGenerator),
    )?.[0]; // get only one because it can't be more than one
  }

  // remove a specific code
  public async removeById(codeId: string): Promise<void> {
    await this.repo.delete({ id: codeId });
  }

  // Store a new code
  public async create(dto: CodesDTO): Promise<CodesDTO> {
    return this.repo.save(dto.toEntity()).then((e) => CodesDTO.fromEntity(e));
  }
}
